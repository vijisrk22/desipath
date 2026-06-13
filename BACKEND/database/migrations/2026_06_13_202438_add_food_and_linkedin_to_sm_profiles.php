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
        Schema::table('sm_profiles', function (Blueprint $table) {
            $table->string('food_preference')->nullable();
            $table->string('linkedin_url')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sm_profiles', function (Blueprint $table) {
            $table->dropColumn(['food_preference', 'linkedin_url']);
        });
    }
};
