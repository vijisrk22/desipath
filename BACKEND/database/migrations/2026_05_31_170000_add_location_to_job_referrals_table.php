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
        Schema::table('job_referrals', function (Blueprint $table) {
            $table->string('city')->nullable()->after('resume_url');
            $table->string('state')->nullable()->after('city');
            $table->string('zipcode')->nullable()->after('state');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_referrals', function (Blueprint $table) {
            $table->dropColumn(['city', 'state', 'zipcode']);
        });
    }
};
