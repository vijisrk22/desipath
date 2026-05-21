<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('BuySellHomes', function (Blueprint $table) {
            $table->string('status')->default('active');
        });

        // Set existing records to active
        DB::table('BuySellHomes')->whereNull('status')->update(['status' => 'active']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('BuySellHomes', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
