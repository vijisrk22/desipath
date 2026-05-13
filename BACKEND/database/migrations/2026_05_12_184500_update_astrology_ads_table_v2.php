<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateAstrologyAdsTableV2 extends Migration
{
    public function up()
    {
        Schema::table('AstrologyAds', function (Blueprint $table) {
            $table->string('slug')->unique()->after('id')->nullable();
            $table->string('display_name')->after('user_id')->nullable();
            $table->integer('experience_years')->after('display_name')->default(0);
            $table->string('tagline')->after('experience_years')->nullable();
            $table->string('profile_pic_url')->after('image')->nullable();
            $table->string('cover_img_url')->after('profile_pic_url')->nullable();
            $table->string('country')->after('state')->nullable();
            $table->string('phone')->after('country')->nullable();
            $table->string('email')->after('phone')->nullable();
            $table->text('certifications')->after('description')->nullable();
            $table->string('status')->default('pending')->after('certifications'); // pending, approved, rejected
            $table->json('consultation_modes')->after('status')->nullable(); // phone, video, chat, in-person, report
            $table->json('locations_served')->after('consultation_modes')->nullable();
            $table->json('languages_json')->after('language')->nullable();
            $table->json('services_json')->after('languages_json')->nullable();
        });

        // Packages Table
        Schema::create('astrology_packages', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('astrology_ad_id');
            $table->string('name');
            $table->string('duration');
            $table->decimal('price', 10, 2);
            $table->string('currency')->default('USD');
            $table->text('description')->nullable();
            $table->boolean('is_popular')->default(false);
            $table->timestamps();

            $table->foreign('astrology_ad_id')->references('id')->on('AstrologyAds')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('astrology_packages');
        Schema::table('AstrologyAds', function (Blueprint $table) {
            $table->dropColumn([
                'slug', 'display_name', 'experience_years', 'tagline', 
                'profile_pic_url', 'cover_img_url', 'country', 'phone', 
                'email', 'certifications', 'status', 'consultation_modes', 
                'locations_served', 'languages_json', 'services_json'
            ]);
        });
    }
}
