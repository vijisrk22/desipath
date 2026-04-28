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
        Schema::table('BuySellCars', function (Blueprint $table) {
            $table->string('location_city')->nullable()->after('location');
            $table->string('location_state')->nullable()->after('location_city');
            $table->string('location_zipcode')->nullable()->after('location_state');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('BuySellCars', function (Blueprint $table) {
            $table->dropColumn(['location_city', 'location_state', 'location_zipcode']);
        });
    }
};
