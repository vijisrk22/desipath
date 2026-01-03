<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTravelCompanionsTable extends Migration
{
    public function up()
    {
        Schema::create('TravelCompanions', function (Blueprint $table) {
            $table->id();
            $table->string('travellers');
            $table->string('language_spoken')->nullable(); // Modified for SQLite compatibility (was set)
            $table->string('language_travellers')->nullable(); // Modified for SQLite compatibility (was set)
            $table->date('travel_date')->nullable();
            $table->boolean('flexible_language')->nullable();
            $table->boolean('tentative')->nullable();
            $table->boolean('travel_finalized')->nullable();
            $table->date('finalized_date')->nullable();
            $table->string('from_location');
            $table->string('to_location');
            $table->enum('service_preference', ['Amazon gift card', 'Volunteer (Free service)'])->nullable();
            $table->enum('amazon_gift_card_value', ['50$', '100$'])->nullable();
            $table->boolean('willing_gift')->nullable();
            $table->enum('gift_card_value', ['50$', '100$'])->nullable();
            $table->foreignId('poster_id')->nullable();
            $table->datetime('created_at')->nullable();
            $table->datetime('updated_at')->nullable();

            // Foreign key constraint
            $table->foreign('poster_id')->references('id')->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('TravelCompanions');
    }
}

