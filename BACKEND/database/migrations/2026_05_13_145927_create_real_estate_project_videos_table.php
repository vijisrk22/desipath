<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('real_estate_project_videos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('real_estate_ad_id')->constrained('real_estate_ads')->onDelete('cascade');
            $table->string('video_url');
            $table->string('title')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('real_estate_project_videos');
    }
};
