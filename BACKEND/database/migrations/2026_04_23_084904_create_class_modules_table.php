<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('class_modules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('class_id')->constrained('kids_classes')->cascadeOnDelete();
            $table->integer('sort_order')->default(0);
            $table->string('title', 255)->nullable();
            $table->text('description')->nullable();
            $table->string('estimated_duration', 100)->nullable();
            $table->json('topics')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('class_modules');
    }
};
