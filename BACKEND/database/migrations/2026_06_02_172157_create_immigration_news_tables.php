<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. news_raw_queue
        Schema::create('news_raw_queue', function (Blueprint $table) {
            $table->id();
            $table->string('source_name', 100);
            $table->enum('source_type', ['official_govt', 'news_site', 'advocacy', 'legal', 'community']);
            $table->string('source_url', 500);
            $table->char('source_url_hash', 32)->index();
            $table->string('original_title', 300);
            $table->text('original_excerpt')->nullable();
            $table->text('original_body')->nullable();
            $table->string('original_author', 150)->nullable();
            $table->timestamp('original_published_at')->nullable();
            $table->boolean('paywall_suspected')->default(false);
            $table->boolean('is_government_source')->default(false);
            $table->string('crawl_run_id', 50)->nullable();
            $table->enum('processing_status', ['pending', 'processing', 'stage1_passed', 'stage1_failed', 'stage2_done', 'stage3_done', 'published', 'rejected', 'manual_review', 'error'])->default('pending');
            $table->json('stage1_response_json')->nullable();
            $table->json('stage2_response_json')->nullable();
            $table->json('stage3_response_json')->nullable();
            $table->tinyInteger('retry_count')->default(0);
            $table->text('error_log')->nullable();
            $table->timestamps();
        });

        // 2. immigration_news
        Schema::create('immigration_news', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 200)->unique();
            $table->foreignId('raw_queue_id')->constrained('news_raw_queue')->onDelete('cascade');
            $table->string('source_name', 100);
            $table->enum('source_type', ['official_govt', 'news_site', 'advocacy', 'legal', 'community']);
            $table->string('source_url', 500);
            $table->string('original_title', 300);
            $table->string('ai_headline', 150);
            $table->text('ai_summary');
            $table->text('ai_nri_angle');
            $table->string('ai_action_required', 300)->nullable();
            $table->enum('category', ['h1b', 'green_card', 'uscis_policy', 'travel_passport', 'student_visa', 'employment', 'family_immigration', 'nri_india', 'legal_court', 'community', 'other'])->index();
            $table->json('tags_json')->nullable();
            $table->enum('urgency', ['high', 'medium', 'low'])->index();
            $table->boolean('is_government_source')->default(false);
            $table->boolean('attorney_referral')->default(false);
            $table->string('ai_model_used', 50)->nullable();
            $table->boolean('ai_summary_is_fallback')->default(false);
            $table->enum('moderation_decision', ['auto_pass', 'human_approved', 'auto_reject'])->nullable();
            $table->integer('moderated_by_user_id')->nullable();
            $table->integer('views_count')->default(0);
            $table->integer('saves_count')->default(0);
            $table->integer('share_count')->default(0);
            $table->bigInteger('forum_thread_id')->nullable();
            $table->boolean('notification_sent')->default(false);
            $table->timestamp('notification_sent_at')->nullable();
            $table->enum('status', ['published', 'unpublished', 'removed'])->default('published');
            $table->timestamp('published_at')->nullable();
            $table->timestamp('original_published_at')->nullable();
            $table->timestamps();
            
            $table->index('published_at');
        });

        // 3. news_dedup_hashes
        Schema::create('news_dedup_hashes', function (Blueprint $table) {
            $table->char('hash', 32)->primary();
            $table->string('source_name', 100);
            $table->timestamp('first_seen_at')->useCurrent();
            $table->timestamp('expires_at')->index();
        });

        // 4. news_manual_review_queue
        Schema::create('news_manual_review_queue', function (Blueprint $table) {
            $table->id();
            $table->foreignId('raw_queue_id')->constrained('news_raw_queue')->onDelete('cascade');
            $table->string('ai_headline', 150);
            $table->text('ai_summary');
            $table->string('source_url', 500);
            $table->string('flag_reason', 300);
            $table->json('flags_json')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected', 'edited_and_approved'])->default('pending');
            $table->integer('admin_user_id')->nullable();
            $table->text('admin_notes')->nullable();
            $table->text('admin_edited_summary')->nullable();
            $table->timestamp('actioned_at')->nullable();
            $table->timestamps();
        });

        // 5. user_news_preferences
        Schema::create('user_news_preferences', function (Blueprint $table) {
            $table->foreignId('user_id')->primary()->constrained()->onDelete('cascade');
            $table->boolean('push_urgent_alerts')->default(false);
            $table->boolean('email_daily_digest')->default(false);
            $table->boolean('email_weekly_summary')->default(false);
            $table->boolean('forum_post_alerts')->default(false);
            $table->json('category_filter_json')->nullable();
            $table->timestamp('last_visited_news_at')->nullable();
            $table->json('saved_articles_json')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('immigration_news_tables');
    }
};
