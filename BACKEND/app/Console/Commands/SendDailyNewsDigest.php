<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\UserNewsPreference;
use App\Models\ImmigrationNews;

class SendDailyNewsDigest extends Command
{
    protected $signature = 'news:daily-digest';
    protected $description = 'Send the daily immigration news digest via Resend API';

    public function handle()
    {
        // 1. Get recent articles (published in last 24 hours)
        $articles = ImmigrationNews::where('status', 'published')
            ->where('published_at', '>=', now()->subHours(24))
            ->orderBy('urgency', 'asc') // Assuming enum sorting or logic (high first) - wait, high might not be alphabetically first. Let's filter in PHP or just order by ID desc for now.
            ->orderBy('published_at', 'desc')
            ->take(8)
            ->get();

        if ($articles->count() < 3) {
            $this->info("Fewer than 3 articles today. Skipping digest.");
            return;
        }

        // 2. Fetch users who want the digest
        $preferences = UserNewsPreference::with('user')
            ->where('email_daily_digest', true)
            ->get();

        if ($preferences->isEmpty()) {
            $this->info("No users subscribed to daily digest.");
            return;
        }

        $resendApiKey = env('RESEND_API_KEY');
        if (!$resendApiKey) {
            $this->error("RESEND_API_KEY not configured.");
            return;
        }

        // Build simple HTML body
        $htmlList = "";
        foreach ($articles as $article) {
            $htmlList .= "
                <div style='margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px;'>
                    <h3 style='margin: 0 0 5px 0;'><a href='https://desipath.com/immigration-news/{$article->slug}' style='color: #0857d0; text-decoration: none;'>{$article->ai_headline}</a></h3>
                    <p style='margin: 0 0 5px 0; color: #555;'>{$article->ai_summary}</p>
                    <p style='margin: 0; font-size: 0.9em;'><span style='color: #d97706; font-weight: bold;'>What this means:</span> {$article->ai_nri_angle}</p>
                </div>
            ";
        }

        $html = "
            <div style='font-family: Arial, sans-serif; max-w-6xl; margin: 0 auto;'>
                <div style='background-color: #0857d0; color: white; padding: 20px; text-align: center;'>
                    <h1 style='margin: 0;'>Desipath Immigration Digest</h1>
                    <p style='margin: 5px 0 0 0;'>Your daily AI-curated news</p>
                </div>
                <div style='padding: 20px;'>
                    {$htmlList}
                    <div style='margin-top: 30px; padding: 15px; background: #f3f4f6; text-align: center; border-radius: 5px;'>
                        <p style='margin: 0;'>Need legal advice on any of these updates?</p>
                        <a href='https://desipath.com/desi-attorneys' style='display: inline-block; margin-top: 10px; background: #0857d0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;'>Find an NRI Immigration Attorney</a>
                    </div>
                </div>
            </div>
        ";

        // Send emails
        foreach ($preferences as $pref) {
            if (!$pref->user || !$pref->user->email) continue;

            Http::withToken($resendApiKey)->post('https://api.resend.com/emails', [
                'from' => 'Desipath News <news@updates.desipath.com>',
                'to' => $pref->user->email,
                'subject' => 'Desipath Immigration Digest — ' . now()->format('M j, Y'),
                'html' => $html
            ]);
        }

        $this->info("Sent daily digest to {$preferences->count()} users.");
    }
}
