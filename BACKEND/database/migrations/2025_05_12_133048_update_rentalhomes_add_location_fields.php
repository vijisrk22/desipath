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
        Schema::table('RentalHomes', function (Blueprint $table) {
            $table->string('location_state', 100)->default('Unknown')->after('community_name');
            $table->string('location_city', 100)->default('Unknown')->after('location_state');
            $table->string('location_zipcode', 20)->default('00000')->after('location_city');
            $table->string('owner_name', 255)->default('Unknown')->after('owner_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('RentalHomes', function (Blueprint $table) {
            $table->dropColumn(['location_state', 'location_city', 'location_zipcode', 'owner_name']);
        });
    }
};
