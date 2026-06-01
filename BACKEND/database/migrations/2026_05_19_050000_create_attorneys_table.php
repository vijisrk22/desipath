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
        Schema::create('attorneys', function (Blueprint $table) {
            $table->id('attorney_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('slug', 150)->unique();
            $table->string('first_name', 80);
            $table->string('last_name', 80);
            $table->string('gender', 20)->default('male');
            $table->string('profile_photo_url', 500)->nullable();
            
            // Biography
            $table->string('short_bio', 300);
            $table->text('full_biography');
            $table->text('career_summary')->nullable();
            $table->text('nri_client_statement')->nullable();
            $table->text('personal_note')->nullable();
            $table->boolean('nri_specialisation')->default(false);
            $table->boolean('india_law_knowledge')->default(false);

            // Contact
            $table->string('email', 200);
            $table->string('phone', 20)->nullable();
            $table->string('office_address_street', 200)->nullable();
            $table->string('office_address_city', 80)->nullable();
            $table->char('office_address_state', 2)->nullable();
            $table->string('office_address_zip', 10)->nullable();
            $table->decimal('office_address_lat', 10, 7)->nullable();
            $table->decimal('office_address_lng', 10, 7)->nullable();
            $table->json('multiple_offices_json')->nullable();
            $table->json('consultation_types_json')->nullable();

            // Web presence
            $table->string('website_url', 500)->nullable();
            $table->string('blog_url', 500)->nullable();
            $table->string('blog_platform', 50)->nullable();
            $table->text('blog_description')->nullable();
            $table->json('featured_articles_json')->nullable();
            $table->string('linkedin_url', 500)->nullable();
            $table->string('twitter_url', 500)->nullable();
            $table->string('facebook_url', 500)->nullable();
            $table->string('instagram_url', 500)->nullable();
            $table->json('youtube_videos_json')->nullable();

            // Education
            $table->string('law_school', 200)->nullable();
            $table->string('law_degree', 50)->nullable();
            $table->smallInteger('graduation_year')->nullable();
            $table->string('law_school_honours', 200)->nullable();
            $table->json('additional_degrees_json')->nullable();
            $table->string('undergraduate_institution', 200)->nullable();
            $table->string('undergraduate_degree', 100)->nullable();
            $table->smallInteger('undergraduate_year')->nullable();

            // Bar & Jurisdictions
            $table->json('federal_courts_json')->nullable();
            $table->json('appeals_circuits_json')->nullable();
            $table->boolean('us_supreme_court')->default(false);
            $table->boolean('eoir_admitted')->default(false);
            $table->boolean('us_tax_court')->default(false);
            $table->boolean('india_bci')->default(false);
            $table->string('india_bci_details', 200)->nullable();
            $table->text('other_jurisdictions')->nullable();

            // Fees & Plans
            $table->boolean('accepts_legal_plans')->default(false);
            $table->json('legal_plans_json')->nullable();
            $table->text('legal_plans_note')->nullable();
            $table->decimal('consultation_fee_amount', 10, 2)->nullable();
            $table->string('consultation_duration', 50)->nullable();
            $table->json('billing_model_json')->nullable();
            $table->json('flat_fees_json')->nullable();
            $table->text('retainer_details')->nullable();
            $table->json('payment_methods_json')->nullable();
            $table->text('fee_note')->nullable();

            // Meta & Rankings
            $table->json('languages_json')->nullable();
            $table->json('associations_json')->nullable();
            $table->json('awards_json')->nullable();
            $table->json('publications_json')->nullable();
            
            $table->json('practice_areas_json')->nullable();
            $table->json('services_offered_json')->nullable();
            $table->json('locations_covered_json')->nullable();
            $table->json('states_licensed_json')->nullable();

            $table->tinyInteger('profile_completeness')->default(0);
            $table->string('profile_status', 50)->default('pending');
            $table->decimal('avg_rating', 3, 2)->default(0.00);
            $table->integer('review_count')->default(0);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attorneys');
    }
};
