<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('instructors', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('account_type', ['individual', 'institution']);
            $table->string('name', 255);
            $table->text('profile_photo_url')->nullable();
            $table->text('profile_photo_original_url')->nullable();
            $table->timestamp('profile_photo_uploaded_at')->nullable();
            $table->timestamp('profile_photo_removed_at')->nullable();
            $table->text('bio')->nullable();
            $table->integer('years_experience')->nullable();
            $table->json('qualifications')->nullable();
            $table->json('languages_spoken')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('email', 255)->unique()->nullable();
            $table->string('phone', 20)->nullable();
            $table->boolean('phone_verified')->default(false);
            $table->json('social_links')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('instructors');
    }
};
