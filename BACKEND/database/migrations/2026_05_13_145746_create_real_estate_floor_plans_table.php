<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('real_estate_floor_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('real_estate_ad_id')->constrained('real_estate_ads')->onDelete('cascade');
            $table->string('type'); // e.g., "2 BHK Apartment"
            $table->string('area_sqft');
            $table->string('area_sqm')->nullable();
            $table->decimal('price', 18, 2);
            $table->string('image_path')->nullable();
            $table->string('possession_date')->nullable(); // e.g., "Dec '27 possession"
            $table->string('tag')->nullable(); // e.g., "New Launch"
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('real_estate_floor_plans');
    }
};
