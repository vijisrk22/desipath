<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::table('it_training_classes', function (Blueprint $table) {
            $table->string('training_covers', 70)->nullable()->after('subcategory');
            $table->text('curriculum_pdf_url')->nullable()->after('thumbnail_url');
        });

        Schema::table('it_training_schedules', function (Blueprint $table) {
            $table->string('schedule_category', 50)->nullable()->after('days_of_week'); // Weekday/Weekend
        });

        Schema::create('it_training_leads', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('class_id')->constrained('it_training_classes')->cascadeOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->text('message')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('it_training_leads');

        Schema::table('it_training_schedules', function (Blueprint $table) {
            $table->dropColumn('schedule_category');
        });

        Schema::table('it_training_classes', function (Blueprint $table) {
            $table->dropColumn(['training_covers', 'curriculum_pdf_url']);
        });
    }
};
