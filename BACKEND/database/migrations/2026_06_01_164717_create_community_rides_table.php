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
        Schema::create('community_rides', function (Blueprint $table) {
            $table->id('ride_id');
            $table->string('slug', 200)->unique();
            $table->char('slug_id', 6)->unique();
            $table->foreignId('poster_user_id')->constrained('users')->onDelete('cascade');
            
            $table->enum('ride_type', ['commute', 'event', 'intercity']);
            $table->enum('post_type', ['offering', 'seeking']);
            $table->string('title', 80);
            
            $table->string('from_location_text', 150);
            $table->string('from_city', 80);
            $table->string('from_state', 2)->nullable();
            $table->string('from_zip', 10)->nullable();
            $table->decimal('from_lat', 10, 7)->nullable();
            $table->decimal('from_lng', 10, 7)->nullable();
            
            $table->string('to_location_text', 150);
            $table->string('to_city', 80);
            $table->string('to_state', 2)->nullable();
            $table->decimal('to_lat', 10, 7)->nullable();
            $table->decimal('to_lng', 10, 7)->nullable();
            
            $table->tinyInteger('seats');
            $table->string('language_preference', 50)->nullable();
            $table->enum('gender_preference', ['any', 'women_only', 'men_only'])->nullable();
            $table->enum('fuel_sharing', ['yes', 'no', 'flexible']);
            $table->decimal('fuel_cost_estimate_usd', 6, 2)->nullable();
            $table->enum('contact_preference', ['desipath_only', 'whatsapp_only', 'both']);
            $table->string('whatsapp_number', 20)->nullable();
            $table->string('notes', 300)->nullable();
            
            $table->string('metro_tag', 50)->nullable();
            
            $table->date('trip_date')->nullable();
            $table->time('departure_time')->nullable();
            
            $table->boolean('return_ride_available')->default(false);
            $table->date('return_date')->nullable();
            $table->time('return_time')->nullable();
            
            $table->json('schedule_days_json')->nullable();
            $table->date('schedule_recurring_until')->nullable();
            $table->string('meeting_point', 200)->nullable();
            
            $table->string('event_name', 100)->nullable();
            $table->enum('event_category', ['temple', 'festival', 'cultural', 'sports', 'community', 'other'])->nullable();
            $table->string('event_link_url', 500)->nullable();
            
            $table->json('stops_json')->nullable();
            $table->enum('car_type', ['sedan', 'suv', 'minivan', 'hatchback'])->nullable();
            $table->enum('luggage_space', ['none', 'small', 'medium', 'large'])->nullable();
            
            $table->enum('status', ['active', 'filled', 'expired', 'closed', 'flagged'])->default('active');
            
            $table->integer('connect_count')->default(0);
            $table->integer('report_count')->default(0);
            $table->boolean('featured')->default(false);
            
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('last_active_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('community_rides');
    }
};
