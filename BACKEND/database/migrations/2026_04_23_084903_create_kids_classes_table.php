<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('kids_classes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('instructor_id')->constrained('instructors')->cascadeOnDelete();
            $table->string('title', 255);
            $table->string('category', 100)->index();
            $table->string('subcategory', 100)->index();
            $table->json('level')->nullable();
            $table->json('format')->nullable();
            $table->text('short_description')->nullable();
            $table->text('long_description')->nullable();
            $table->text('thumbnail_url')->nullable();
            $table->text('banner_url')->nullable();
            $table->json('tags')->nullable();
            $table->integer('age_group_min')->nullable();
            $table->integer('age_group_max')->nullable();
            $table->enum('status', ['draft', 'pending_review', 'active', 'expired', 'rejected'])->default('draft');
            $table->enum('visibility', ['public', 'unlisted'])->default('public');
            $table->date('listing_expiry')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('kids_classes');
    }
};
