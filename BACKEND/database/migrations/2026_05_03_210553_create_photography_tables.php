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
        Schema::create('photographers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('bio')->nullable();
            $table->enum('service_type', ['Photographer', 'Videographer', 'Both'])->default('Photographer');
            $table->integer('experience_years')->default(0);
            $table->string('languages')->nullable();
            $table->string('profile_photo')->nullable();
            $table->string('backdrop_photo')->nullable();
            $table->string('video_url')->nullable();
            $table->enum('status', ['active', 'pending', 'inactive'])->default('pending');
            $table->timestamps();
        });

        Schema::create('photographer_packages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('photographer_id')->constrained('photographers')->onDelete('cascade');
            $table->string('name');
            $table->decimal('price', 10, 2);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('photographer_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('photographer_id')->constrained('photographers')->onDelete('cascade');
            $table->string('address')->nullable();
            $table->string('city');
            $table->string('state');
            $table->string('zipcode');
            $table->decimal('lat', 10, 8)->nullable();
            $table->decimal('lng', 11, 8)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('photographer_locations');
        Schema::dropIfExists('photographer_packages');
        Schema::dropIfExists('photographers');
    }
};
