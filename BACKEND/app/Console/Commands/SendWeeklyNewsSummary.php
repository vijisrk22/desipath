<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\UserNewsPreference;
use App\Models\ImmigrationNews;

class SendWeeklyNewsSummary extends Command
{
    protected $signature = 'news:weekly-summary';
    protected $description = 'Send the weekly immigration news summary via Resend API';

    public function handle()
    {
        // 1. Get top 10 articles from the last 7 days (by views_count)
        $articles = ImmigrationNews::where('status', 'published')
            ->where('published_at', '>=', now()->subDays(7))
            ->orderBy('views_count', 'desc')
            ->take(10)
            ->get();

        if ($articles->count() < 3) {
            $this->info("Fewer than 3 articles this week. Skipping summary.");
            return;
        }

        // 2. Fetch users who want the weekly digest
        $preferences = UserNewsPreference::with('user')
            ->where('email_weekly_summary', true)
            ->get();

        if ($preferences->isEmpty()) {
            $this->info("No users subscribed to weekly summary.");
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
                </div>
            ";
        }

        $html = "
            <div style='font-family: Arial, sans-serif; max-w-6xl; margin: 0 auto;'>
                <div style='background-color: #1e40af; color: white; padding: 20px; text-align: center;'>
                    <h1 style='margin: 0;'>Week in NRI Immigration</h1>
                    <p style='margin: 5px 0 0 0;'>The top stories you might have missed</p>
                </div>
                <div style='padding: 20px;'>
                    {$htmlList}
                </div>
            </div>
        ";

        // Send emails
        foreach ($preferences as $pref) {
            if (!$pref->user || !$pref->user->email) continue;

            Http::withToken($resendApiKey)->post('https://api.resend.com/emails', [
                'from' => 'Desipath News <news@updates.desipath.com>',
                'to' => $pref->user->email,
                'subject' => 'Week in NRI Immigration — ' . now()->subDays(7)->format('M j') . ' - ' . now()->format('M j, Y'),
                'html' => $html
            ]);
        }

        $this->info("Sent weekly summary to {$preferences->count()} users.");
    }
}
