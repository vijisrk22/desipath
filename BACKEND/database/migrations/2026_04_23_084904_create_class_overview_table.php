<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('class_overview', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('class_id')->constrained('kids_classes')->cascadeOnDelete();
            $table->text('short_intro')->nullable();
            $table->text('detailed_description')->nullable();
            $table->json('who_is_it_for')->nullable();
            $table->json('what_will_kids_learn')->nullable();
            $table->json('highlights')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('class_overview');
    }
};
