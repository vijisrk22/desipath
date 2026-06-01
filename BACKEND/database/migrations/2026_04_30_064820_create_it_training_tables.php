<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('it_instructors', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('account_type', ['individual', 'institution']);
            $table->string('name', 255);
            $table->text('profile_photo_url')->nullable();
            $table->text('bio')->nullable();
            $table->integer('years_experience')->nullable();
            $table->json('qualifications')->nullable();
            $table->json('languages_spoken')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('email', 255)->unique()->nullable();
            $table->string('phone', 20)->nullable();
            $table->timestamps();
        });

        Schema::create('it_training_classes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('instructor_id')->constrained('it_instructors')->cascadeOnDelete();
            $table->string('title', 255);
            $table->string('category', 100)->index();
            $table->string('subcategory', 100)->index();
            $table->json('level')->nullable();
            $table->json('format')->nullable();
            $table->text('short_description')->nullable();
            $table->text('thumbnail_url')->nullable();
            $table->json('tags')->nullable();
            $table->enum('status', ['draft', 'pending_review', 'active', 'expired', 'rejected'])->default('draft');
            $table->timestamps();
        });

        Schema::create('it_training_overview', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('class_id')->constrained('it_training_classes')->cascadeOnDelete();
            $table->text('detailed_description')->nullable();
            $table->json('who_is_it_for')->nullable();
            $table->json('what_will_learn')->nullable();
            $table->json('highlights')->nullable();
            $table->timestamps();
        });

        Schema::create('it_training_modules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('class_id')->constrained('it_training_classes')->cascadeOnDelete();
            $table->integer('sort_order')->default(0);
            $table->string('title', 255)->nullable();
            $table->text('description')->nullable();
            $table->string('estimated_duration', 100)->nullable();
            $table->timestamps();
        });

        Schema::create('it_training_schedules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('class_id')->constrained('it_training_classes')->cascadeOnDelete();
            $table->string('duration_label', 100)->nullable();
            $table->integer('total_sessions')->nullable();
            $table->integer('session_length_minutes')->nullable();
            $table->json('days_of_week')->nullable();
            $table->time('time_start')->nullable();
            $table->time('time_end')->nullable();
            $table->date('batch_start_date')->nullable();
            $table->text('location_address')->nullable();
            $table->string('online_platform', 100)->nullable();
            $table->integer('max_students')->nullable();
            $table->boolean('trial_available')->default(false);
            $table->timestamps();
        });

        Schema::create('it_training_pricing', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('class_id')->constrained('it_training_classes')->cascadeOnDelete();
            $table->decimal('fee_amount', 10, 2)->nullable();
            $table->char('fee_currency', 3)->default('USD');
            $table->enum('fee_type', ['per_month', 'full_course', 'per_session'])->nullable();
            $table->text('discount_label')->nullable();
            $table->boolean('certificate_provided')->default(false);
            $table->timestamps();
        });

        Schema::create('it_training_requirements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('class_id')->constrained('it_training_classes')->cascadeOnDelete();
            $table->json('prerequisites')->nullable();
            $table->json('materials_needed')->nullable();
            $table->json('tech_requirements')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('it_training_requirements');
        Schema::dropIfExists('it_training_pricing');
        Schema::dropIfExists('it_training_schedules');
        Schema::dropIfExists('it_training_modules');
        Schema::dropIfExists('it_training_overview');
        Schema::dropIfExists('it_training_classes');
        Schema::dropIfExists('it_instructors');
    }
};
