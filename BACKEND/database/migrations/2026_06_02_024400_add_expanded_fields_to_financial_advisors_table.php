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
        Schema::table('financial_advisors', function (Blueprint $table) {
            $table->string('consultant_name')->nullable()->after('user_id');
            $table->string('advisor_profile_image')->nullable()->after('consultant_name');
            $table->string('cover_image')->nullable()->after('advisor_profile_image');
            $table->json('states_licensed')->nullable()->after('primary_city');
            $table->string('qualifications')->nullable()->after('cover_image');
            $table->string('accreditations')->nullable()->after('qualifications');
            $table->string('contact_email')->nullable()->after('zip_code');
            $table->string('contact_phone')->nullable()->after('contact_email');
            $table->string('website')->nullable()->after('contact_phone');
            $table->string('free_consultation')->nullable()->after('website'); // e.g. "30 min", "60 min"
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('financial_advisors', function (Blueprint $table) {
            $table->dropColumn([
                'consultant_name',
                'advisor_profile_image',
                'cover_image',
                'states_licensed',
                'qualifications',
                'accreditations',
                'contact_email',
                'contact_phone',
                'website',
                'free_consultation'
            ]);
        });
    }
};
