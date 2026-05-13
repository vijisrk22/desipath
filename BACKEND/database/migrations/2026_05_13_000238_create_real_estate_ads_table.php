<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRealEstateAdsTable extends Migration
{
    public function up()
    {
        Schema::create('real_estate_ads', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('slug')->unique();
            $table->string('title');
            $table->text('description');
            $table->string('property_type'); // Apartment, Villa, Individual House
            $table->string('country'); // India, Dubai
            $table->string('city');
            $table->string('state')->nullable();
            $table->string('address')->nullable();
            $table->decimal('price', 15, 2);
            $table->string('currency')->default('INR'); // INR, AED, USD
            $table->integer('area_sqft')->nullable();
            $table->integer('bedrooms')->nullable();
            $table->integer('bathrooms')->nullable();
            $table->string('agent_name')->nullable();
            $table->string('agent_company')->nullable();
            $table->string('agent_phone')->nullable();
            $table->string('agent_email')->nullable();
            $table->string('main_image')->nullable();
            $table->string('video_url')->nullable();
            $table->json('features')->nullable(); // Swimming pool, Gym, etc.
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('real_estate_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('real_estate_ad_id');
            $table->string('image_path');
            $table->timestamps();

            $table->foreign('real_estate_ad_id')->references('id')->on('real_estate_ads')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('real_estate_images');
        Schema::dropIfExists('real_estate_ads');
    }
}
