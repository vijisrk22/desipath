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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('user_type')->default('Owner'); // Agent or Owner
            $table->string('event_name'); // Mapped to title on frontend sometimes, but form calls it eventName
            $table->string('address'); 
            $table->string('state_city_zipcode');
            $table->dateTime('from_date');
            $table->string('language');
            $table->string('event_type');
            $table->text('description'); 
            $table->decimal('ticket_price', 10, 2);
            $table->json('cover_images')->nullable();
            $table->json('poster_images')->nullable();
            $table->unsignedBigInteger('user_id')->nullable(); // Set nullable for now to fit existing patterns if auth is loose
            $table->string('user_name')->nullable();
            $table->timestamps();

            // Foreign key constraint if using Users table
            // $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
