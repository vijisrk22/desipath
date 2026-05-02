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
        Schema::table('business_accounts', function (Blueprint $table) {
            $table->string('address_line1')->nullable()->after('owner_name');
            $table->string('zipcode')->nullable()->after('city');
            $table->string('contact_person_name')->nullable()->after('email');
            $table->string('contact_person_email')->nullable()->after('contact_person_name');
            $table->string('contact_person_phone')->nullable()->after('contact_person_email');
        });

        Schema::table('local_ads', function (Blueprint $table) {
            $table->string('display_phone')->nullable()->after('poster_urls');
            $table->string('display_email')->nullable()->after('display_phone');
            $table->boolean('is_contact_person_different')->default(false)->after('display_email');
            $table->string('ad_contact_name')->nullable()->after('is_contact_person_different');
            $table->string('ad_contact_email')->nullable()->after('ad_contact_name');
            $table->string('ad_contact_phone')->nullable()->after('ad_contact_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('business_accounts', function (Blueprint $table) {
            $table->dropColumn(['address_line1', 'zipcode', 'contact_person_name', 'contact_person_email', 'contact_person_phone']);
        });

        Schema::table('local_ads', function (Blueprint $table) {
            $table->dropColumn(['display_phone', 'display_email', 'is_contact_person_different', 'ad_contact_name', 'ad_contact_email', 'ad_contact_phone']);
        });
    }
};
