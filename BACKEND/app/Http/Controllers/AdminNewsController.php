<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NewsManualReviewQueue;
use App\Models\ImmigrationNews;
use App\Models\NewsRawQueue;
use Illuminate\Support\Str;

class AdminNewsController extends Controller
{
    /**
     * Get all pending articles in the manual review queue.
     */
    public function getQueue(Request $request)
    {
        $queue = NewsManualReviewQueue::where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($queue);
    }

    /**
     * Approve a queued article and publish it to the live feed.
     */
    public function approve(Request $request, $id)
    {
        $reviewItem = NewsManualReviewQueue::findOrFail($id);
        
        if ($reviewItem->status !== 'pending') {
            return response()->json(['error' => 'Item is not pending'], 400);
        }

        // Check if admin provided an edited summary
        $editedSummary = $request->input('edited_summary');
        
        $rawArticle = NewsRawQueue::findOrFail($reviewItem->raw_queue_id);
        
        // Parse the stage 2 response to get all the original AI data
        $stage2Data = json_decode($rawArticle->stage2_response_json, true);
        
        if (!$stage2Data) {
            return response()->json(['error' => 'Missing AI data in raw queue'], 500);
        }

        // Create the live published article
        $slug = Str::slug($reviewItem->ai_headline) . '-' . substr(uniqid(), -6);

        $news = new ImmigrationNews();
        $news->slug = $slug;
        $news->raw_queue_id = $rawArticle->id;
        $news->source_name = $rawArticle->source_name;
        $news->source_type = $rawArticle->source_type;
        $news->source_url = $rawArticle->source_url;
        $news->original_title = $rawArticle->original_title;
        $news->ai_headline = $reviewItem->ai_headline;
        
        // Use edited summary if provided, otherwise the original one
        $news->ai_summary = $editedSummary ?: $reviewItem->ai_summary;
        
        $news->ai_nri_angle = $stage2Data['nri_angle'] ?? null;
        $news->ai_action_required = $stage2Data['action_required'] ?? null;
        $news->category = $stage2Data['category'] ?? 'other';
        $news->tags_json = $stage2Data['tags'] ?? [];
        $news->urgency = $stage2Data['urgency'] ?? 'low';
        $news->is_government_source = $rawArticle->is_government_source;
        $news->attorney_referral = $stage2Data['attorney_referral'] ?? false;
        
        $news->ai_model_used = 'claude-sonnet-4-6';
        $news->ai_summary_is_fallback = $stage2Data['fallback_used'] ?? false;
        
        $news->moderation_decision = 'human_approved';
        $news->moderated_by_user_id = 1; // Assuming admin user ID 1 for now
        $news->status = 'published';
        $news->published_at = now();
        $news->original_published_at = $rawArticle->original_published_at;
        
        $news->save();

        // Update the review item
        $reviewItem->status = $editedSummary ? 'edited_and_approved' : 'approved';
        $reviewItem->admin_edited_summary = $editedSummary;
        $reviewItem->actioned_at = now();
        $reviewItem->save();

        // Update the raw queue
        $rawArticle->processing_status = 'published';
        $rawArticle->save();

        return response()->json(['success' => true, 'article' => $news]);
    }

    /**
     * Reject a queued article.
     */
    public function reject(Request $request, $id)
    {
        $reviewItem = NewsManualReviewQueue::findOrFail($id);
        
        if ($reviewItem->status !== 'pending') {
            return response()->json(['error' => 'Item is not pending'], 400);
        }

        $reviewItem->status = 'rejected';
        $reviewItem->actioned_at = now();
        $reviewItem->save();

        // Update the raw queue
        $rawArticle = NewsRawQueue::find($reviewItem->raw_queue_id);
        if ($rawArticle) {
            $rawArticle->processing_status = 'rejected';
            $rawArticle->save();
        }

        return response()->json(['success' => true]);
    }
}
