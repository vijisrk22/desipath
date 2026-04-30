<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('marketplace_categories', function (Blueprint $table) {
            $table->id();
            $table->string('module')->index(); // 'kids_class', 'it_training'
            $table->string('name');
            $table->string('slug')->index();
            $table->string('icon')->nullable();
            $table->string('color')->nullable();
            $table->string('accent')->nullable();
            $table->timestamps();
            
            $table->unique(['module', 'slug']);
        });

        Schema::create('marketplace_subcategories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('marketplace_categories')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->string('icon')->nullable();
            $table->timestamps();
            
            $table->unique(['category_id', 'slug']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('marketplace_subcategories');
        Schema::dropIfExists('marketplace_categories');
    }
};
