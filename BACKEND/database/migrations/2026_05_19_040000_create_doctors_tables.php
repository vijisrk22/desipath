<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id('doctor_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('slug', 150)->unique();
            $table->boolean('slug_customised')->default(false);
            $table->timestamp('slug_customised_at')->nullable();
            $table->char('npi_number', 10)->unique()->nullable();
            $table->boolean('npi_verified')->default(false);
            $table->timestamp('npi_verified_at')->nullable();
            $table->string('credential', 20)->default('MD');
            $table->string('first_name', 80);
            $table->string('last_name', 80);
            $table->string('gender', 20)->default('male');
            $table->string('profile_photo_url', 500)->nullable();
            $table->text('nri_specialist_statement')->nullable();
            $table->string('headline', 120)->nullable();
            $table->text('bio')->nullable();
            $table->string('primary_specialty', 80);
            $table->json('subspecialties_json')->nullable();
            $table->json('board_certifications_json')->nullable();
            $table->json('conditions_treated_json')->nullable();
            $table->json('procedures_json')->nullable();
            $table->json('indian_health_specialisations_json')->nullable();
            $table->string('practice_name', 200)->nullable();
            $table->string('practice_type', 50)->default('solo');
            $table->string('primary_address_street', 200)->nullable();
            $table->string('primary_address_city', 80)->nullable();
            $table->char('primary_address_state', 2)->nullable();
            $table->string('primary_address_zip', 10)->nullable();
            $table->decimal('primary_address_lat', 10, 7)->nullable();
            $table->decimal('primary_address_lng', 10, 7)->nullable();
            $table->string('fax', 20)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('email', 200)->nullable();
            $table->string('website_url', 500)->nullable();
            $table->string('appointment_booking_url', 500)->nullable();
            $table->json('office_hours_json')->nullable();
            $table->json('additional_locations_json')->nullable();
            $table->boolean('telehealth_available')->default(false);
            $table->json('telehealth_states_json')->nullable();
            $table->boolean('accepting_new_patients')->default(true);
            $table->boolean('same_day_available')->default(false);
            $table->json('insurance_plans_json')->nullable();
            $table->boolean('self_pay_accepted')->default(false);
            $table->integer('self_pay_fee_min')->nullable();
            $table->integer('self_pay_fee_max')->nullable();
            $table->boolean('medicaid_accepted')->default(false);
            $table->json('languages_json')->nullable();
            $table->json('office_languages_json')->nullable();
            $table->string('cultural_background', 100)->nullable();
            $table->string('india_medical_training', 50)->nullable();
            $table->string('india_medical_college', 150)->nullable();
            $table->boolean('visiting_parents_care')->default(false);
            $table->boolean('medical_proxy_assistance')->default(false);
            $table->boolean('is_desi_doctor')->default(true);
            $table->boolean('nri_specialist')->default(false);
            $table->json('metro_tags_json')->nullable();
            $table->string('medical_school', 200)->nullable();
            $table->integer('medical_school_year')->nullable();
            $table->string('residency_program', 200)->nullable();
            $table->string('residency_hospital', 200)->nullable();
            $table->integer('residency_year')->nullable();
            $table->json('fellowships_json')->nullable();
            $table->string('linkedin_url', 500)->nullable();
            $table->json('youtube_videos_json')->nullable();
            $table->string('blog_url', 500)->nullable();
            $table->string('subscription_plan', 50)->default('free_unclaimed');
            $table->string('verified_badge_level', 50)->default('none');
            $table->decimal('avg_rating', 3, 2)->default(0.00);
            $table->integer('review_count')->default(0);
            $table->tinyInteger('profile_completeness')->default(0);
            $table->string('profile_status', 50)->default('pending');
            $table->timestamps();
        });

        Schema::create('doctor_affiliations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('doctor_id');
            $table->string('facility_name', 200);
            $table->string('facility_type', 50)->default('hospital');
            $table->string('affiliation_type', 50)->default('affiliated');
            $table->string('address_street', 200)->nullable();
            $table->string('address_city', 80)->nullable();
            $table->char('address_state', 2)->nullable();
            $table->string('address_zip', 10)->nullable();
            $table->decimal('lat', 10, 7)->nullable();
            $table->decimal('lng', 10, 7)->nullable();
            $table->string('phone', 20)->nullable();
            $table->decimal('cms_star_rating', 2, 1)->nullable();
            $table->json('awards_json')->nullable();
            $table->string('cms_provider_id', 10)->nullable();
            $table->tinyInteger('sort_order')->default(1);
            $table->timestamps();

            $table->foreign('doctor_id')->references('doctor_id')->on('doctors')->onDelete('cascade');
        });

        Schema::create('doctor_awards', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('doctor_id');
            $table->string('award_name', 200);
            $table->string('award_type', 50)->default('other');
            $table->string('awarding_org', 200);
            $table->text('description')->nullable();
            $table->json('years_json');
            $table->string('badge_logo_url', 500)->nullable();
            $table->boolean('is_system_generated')->default(false);
            $table->timestamps();

            $table->foreign('doctor_id')->references('doctor_id')->on('doctors')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctor_awards');
        Schema::dropIfExists('doctor_affiliations');
        Schema::dropIfExists('doctors');
    }
};
