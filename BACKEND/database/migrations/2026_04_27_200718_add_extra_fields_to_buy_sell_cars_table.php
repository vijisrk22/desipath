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
            $table->string('drive_type')->nullable()->after('condition_id');
            $table->string('mpg')->nullable()->after('drive_type');
            $table->string('vin')->nullable()->after('mpg');
            $table->json('features')->nullable()->after('vin');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('BuySellCars', function (Blueprint $table) {
            $table->dropColumn(['drive_type', 'mpg', 'vin', 'features']);
        });
    }
};
