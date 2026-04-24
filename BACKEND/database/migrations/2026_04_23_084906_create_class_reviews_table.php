<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('class_reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('class_id')->constrained('kids_classes')->cascadeOnDelete();
            $table->string('student_name', 255)->nullable();
            $table->decimal('rating', 2, 1)->nullable();
            $table->text('review_text')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('class_reviews');
    }
};
