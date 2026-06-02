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
        Schema::create('financial_advisors', function (Blueprint $table) {
            $table->id('advisor_id');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Highlights & Identity
            $table->string('slug')->unique();
            $table->string('firm_name')->nullable();
            $table->integer('years_experience')->default(0);
            $table->text('nri_specialist_statement')->nullable(); // High priority field
            $table->boolean('accepting_new_clients')->default(true);
            $table->string('profile_status')->default('active'); // active, inactive, pending_verification
            
            // NRI Specialties (Boolean/Toggles)
            $table->boolean('fbar_fatca_advisory')->default(false);
            $table->boolean('pfic_advisory')->default(false);
            $table->boolean('dtaa_optimization')->default(false);
            $table->boolean('return_to_india_planning')->default(false);
            $table->boolean('india_investments')->default(false);
            
            // Compliance & Registration
            $table->string('finra_crd_number')->nullable();
            $table->string('sec_ria_registration')->nullable();
            $table->string('sebi_registration')->nullable();
            $table->boolean('disciplinary_history')->default(false);
            
            // Services
            $table->json('services')->nullable(); // e.g. ["Investment Strategy", "Life Insurance", "401k/IRA"]
            $table->json('credentials')->nullable(); // e.g. ["CFP", "CFA", "CPA"]
            
            // Fees
            $table->string('fee_structure_type'); // fee-only, fee-based, aum-based, commission, hourly
            $table->decimal('minimum_investment', 15, 2)->nullable();
            $table->decimal('aum_fee_percentage', 5, 2)->nullable();
            $table->decimal('hourly_rate', 8, 2)->nullable();
            
            // Location & Contact
            $table->string('primary_city');
            $table->string('state', 2)->nullable();
            $table->string('zip_code', 10)->nullable();
            $table->json('languages')->nullable();
            $table->boolean('virtual_consultation')->default(true);
            $table->boolean('india_time_zone_consultation')->default(false);
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('financial_advisors');
    }
};
