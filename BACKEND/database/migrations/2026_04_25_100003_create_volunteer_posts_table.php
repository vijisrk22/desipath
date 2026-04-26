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
        Schema::create('volunteer_posts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('travelling_as', ['individual', 'couple', 'family']);
            $table->boolean('prior_experience')->default(false);
            $table->json('comfortable_helping')->nullable();
            $table->enum('travel_direction', ['india_to_usa_canada', 'usa_canada_to_india']);
            $table->json('route_legs');
            $table->boolean('travel_date_confirmed')->default(false);
            $table->date('travel_date')->nullable();
            $table->date('travel_month_from')->nullable();
            $table->date('travel_month_to')->nullable();
            $table->json('languages')->nullable();
            $table->boolean('language_flexible')->default(false);
            $table->enum('gift_card_preference', ['free', '50', '100'])->default('free');
            $table->text('comments')->nullable();
            $table->enum('status', ['active', 'matched', 'expired', 'closed'])->default('active')->index();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('volunteer_posts');
    }
};
