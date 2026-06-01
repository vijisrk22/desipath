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
        Schema::create('travel_matches', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('request_post_id')->index();
            $table->uuid('volunteer_post_id')->index();
            $table->foreignId('seeker_user_id')->index();
            $table->foreignId('volunteer_user_id')->index();
            $table->uuid('chat_thread_id')->nullable();
            $table->enum('match_quality', ['full', 'strong', 'destination', 'partial']);
            $table->enum('status', ['connected', 'confirmed', 'completed', 'cancelled'])->default('connected');
            $table->timestamp('matched_at')->useCurrent();
            $table->date('travel_date')->nullable();
            $table->timestamp('review_requested_at')->nullable();
            $table->timestamps();
        });

        Schema::create('moderation_reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('reporter_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('reported_user_id')->constrained('users')->onDelete('cascade')->index();
            $table->uuid('post_id')->nullable();
            $table->enum('reason_code', ['fake_profile', 'money_request', 'inappropriate', 'pii_sharing', 'fraud', 'other']);
            $table->text('details')->nullable();
            $table->enum('status', ['pending', 'reviewed', 'actioned', 'dismissed'])->default('pending')->index();
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('moderation_reports');
        Schema::dropIfExists('travel_matches');
    }
};
