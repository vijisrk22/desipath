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
        Schema::table('it_training_schedules', function (Blueprint $table) {
            $table->string('timezone', 10)->nullable()->after('time_end'); // IST, EST, etc.
        });

        Schema::table('it_training_pricing', function (Blueprint $table) {
            $table->string('currency', 5)->default('USD')->after('fee_amount'); // USD, INR, etc.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('it_training_pricing', function (Blueprint $table) {
            $table->dropColumn('currency');
        });

        Schema::table('it_training_schedules', function (Blueprint $table) {
            $table->dropColumn('timezone');
        });
    }
};
