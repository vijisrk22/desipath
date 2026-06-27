<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NewsletterSubscription;
use App\Mail\NewsletterConfirmationMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class NewsletterController extends Controller
{
    /**
     * Subscribe to newsletter
     */
    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $email = $request->input('email');
        
        $subscription = NewsletterSubscription::where('email', $email)->first();

        if ($subscription) {
            if ($subscription->status === 'confirmed') {
                return response()->json(['success' => true, 'message' => 'Already subscribed!']);
            }
            // If pending, just generate a new token and resend
            $token = Str::random(60);
            $subscription->update(['token' => $token]);
        } else {
            $token = Str::random(60);
            NewsletterSubscription::create([
                'email' => $email,
                'token' => $token,
                'status' => 'pending'
            ]);
        }

        try {
            Mail::to($email)->send(new NewsletterConfirmationMail($token));
        } catch (\Exception $e) {
            // Log error or ignore in dev
        }

        return response()->json(['success' => true, 'message' => 'Subscription pending. Check your email.']);
    }

    /**
     * Confirm subscription
     */
    public function confirm($token)
    {
        $subscription = NewsletterSubscription::where('token', $token)->first();

        if (!$subscription) {
            return view('newsletter.error', ['message' => 'Invalid or expired confirmation link.']);
        }

        $subscription->update([
            'status' => 'confirmed',
            'token' => null // Clear token after use
        ]);

        return view('newsletter.success', ['message' => 'Your subscription has been successfully confirmed!']);
    }
}
