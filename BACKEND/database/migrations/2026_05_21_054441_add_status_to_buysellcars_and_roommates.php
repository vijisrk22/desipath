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
            if (!Schema::hasColumn('BuySellCars', 'status')) {
                $table->string('status')->default('active');
            }
        });

        Schema::table('RoomMates', function (Blueprint $table) {
            if (!Schema::hasColumn('RoomMates', 'status')) {
                $table->string('status')->default('active');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('BuySellCars', function (Blueprint $table) {
            if (Schema::hasColumn('BuySellCars', 'status')) {
                $table->dropColumn('status');
            }
        });

        Schema::table('RoomMates', function (Blueprint $table) {
            if (Schema::hasColumn('RoomMates', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
};
