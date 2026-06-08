<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\UnreadMessageReminder;
use Carbon\Carbon;

class CronController extends Controller
{
    public function sendUnreadReminders(Request $request)
    {
        // 1. Validate Secret Token
        $secret = env('CRON_SECRET', 'desipath_cron_secret'); // Fallback for local testing
        if ($request->token !== $secret) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // 2. Fetch unread messages older than 1 hour, reminder_count < 3
        // Group by receiver_id to send one email per user
        $messages = Message::where('is_read', 0)
            ->where('reminder_count', '<', 3)
            ->where('created_at', '<=', Carbon::now()->subHour())
            ->get();

        if ($messages->isEmpty()) {
            return response()->json(['message' => 'No unread messages found needing reminders'], 200);
        }

        $groupedByReceiver = $messages->groupBy('receiver_id');

        $emailsSent = 0;

        foreach ($groupedByReceiver as $receiverId => $userMessages) {
            $user = User::find($receiverId);
            if ($user && $user->email) {
                // Send email
                Mail::to($user->email)->send(new UnreadMessageReminder($user, $userMessages->count()));
                $emailsSent++;

                // Increment reminder count
                foreach ($userMessages as $msg) {
                    $msg->reminder_count = $msg->reminder_count + 1;
                    $msg->save();
                }
            }
        }

        return response()->json([
            'message' => "Successfully processed unread messages.",
            'emails_sent' => $emailsSent,
            'messages_updated' => $messages->count()
        ], 200);
    }
}
