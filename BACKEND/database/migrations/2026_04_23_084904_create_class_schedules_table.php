<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('class_schedules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('class_id')->constrained('kids_classes')->cascadeOnDelete();
            $table->string('duration_label', 100)->nullable();
            $table->integer('total_sessions')->nullable();
            $table->integer('session_length_minutes')->nullable();
            $table->json('days_of_week')->nullable();
            $table->time('time_start')->nullable();
            $table->time('time_end')->nullable();
            $table->date('batch_start_date')->nullable();
            $table->text('location_address')->nullable();
            $table->string('online_platform', 100)->nullable();
            $table->text('online_link')->nullable();
            $table->integer('max_students')->nullable();
            $table->boolean('trial_available')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('class_schedules');
    }
};
