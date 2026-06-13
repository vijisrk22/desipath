<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SecureMatchInterest;
use App\Models\SecureMatchProfile;
use Illuminate\Support\Facades\Auth;

class SecureMatchInterestController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'receiver_profile_id' => 'required|exists:sm_profiles,id'
        ]);

        $receiverProfile = SecureMatchProfile::findOrFail($request->receiver_profile_id);

        if ($receiverProfile->user_id == Auth::id()) {
            return response()->json(['message' => 'Cannot send interest to yourself'], 400);
        }

        // Check if interest already exists
        $existing = SecureMatchInterest::where('sender_id', Auth::id())
            ->where('receiver_id', $receiverProfile->user_id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Interest already sent'], 400);
        }

        $interest = SecureMatchInterest::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $receiverProfile->user_id,
            'status' => 'pending'
        ]);

        return response()->json(['message' => 'Interest sent successfully', 'interest' => $interest], 201);
    }

    public function acceptStep1($id)
    {
        $interest = SecureMatchInterest::where('id', $id)
            ->where('receiver_id', Auth::id())
            ->where('status', 'pending')
            ->firstOrFail();

        $interest->update([
            'status' => 'accepted_step1',
            'step1_accepted_at' => now()
        ]);

        return response()->json(['message' => 'Step 1 accepted. Personal details unlocked.']);
    }

    public function acceptStep2($id)
    {
        $interest = SecureMatchInterest::where('id', $id)
            ->where('receiver_id', Auth::id())
            ->where('status', 'accepted_step1')
            ->firstOrFail();

        $interest->update([
            'status' => 'accepted_step2',
            'step2_accepted_at' => now()
        ]);

        return response()->json(['message' => 'Step 2 accepted. Photos unlocked.']);
    }

    public function decline($id)
    {
        $interest = SecureMatchInterest::where('id', $id)
            ->where('receiver_id', Auth::id())
            ->firstOrFail();

        $interest->update(['status' => 'declined']);

        return response()->json(['message' => 'Interest declined']);
    }

    public function received()
    {
        $interests = SecureMatchInterest::with('sender.secureMatchProfile.photos')
            ->where('receiver_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($interests);
    }

    public function sent()
    {
        $interests = SecureMatchInterest::with('receiver.secureMatchProfile.photos')
            ->where('sender_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($interests);
    }

    public function requestAlbum($id)
    {
        $interest = SecureMatchInterest::where('id', $id)
            ->where(function ($query) {
                $query->where('sender_id', Auth::id())
                      ->orWhere('receiver_id', Auth::id());
            })->firstOrFail();

        if ($interest->sender_id == Auth::id()) {
            $interest->update(['sender_requested_album' => true]);
        } else {
            $interest->update(['receiver_requested_album' => true]);
        }

        return response()->json(['message' => 'Album requested']);
    }

    public function toggleAlbum($id)
    {
        $interest = SecureMatchInterest::where('id', $id)
            ->where(function ($query) {
                $query->where('sender_id', Auth::id())
                      ->orWhere('receiver_id', Auth::id());
            })->firstOrFail();

        if ($interest->sender_id == Auth::id()) {
            $interest->update(['sender_album_unlocked' => !$interest->sender_album_unlocked]);
            $status = $interest->sender_album_unlocked;
        } else {
            $interest->update(['receiver_album_unlocked' => !$interest->receiver_album_unlocked]);
            $status = $interest->receiver_album_unlocked;
        }

        return response()->json(['message' => $status ? 'Album shared successfully' : 'Album locked']);
    }
}
