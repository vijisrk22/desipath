<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('class_requirements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('class_id')->constrained('kids_classes')->cascadeOnDelete();
            $table->json('prerequisites')->nullable();
            $table->json('materials_needed')->nullable();
            $table->json('tech_requirements')->nullable();
            $table->enum('parental_involvement', ['none', 'occasional', 'required'])->nullable();
            $table->text('parental_involvement_notes')->nullable();
            $table->integer('min_age')->nullable();
            $table->integer('max_age')->nullable();
            $table->text('other_requirements')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('class_requirements');
    }
};
