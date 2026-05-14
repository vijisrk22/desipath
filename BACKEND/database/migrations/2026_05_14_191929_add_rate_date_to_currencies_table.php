<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('currencies', function (Blueprint $table) {
            $table->date('rate_date')->nullable()->after('rate_to_usd')
                  ->comment('The date on which this exchange rate was last verified/updated');
        });

        // Backfill existing rows with today's date
        DB::table('currencies')->update(['rate_date' => now()->toDateString()]);
    }

    public function down(): void
    {
        Schema::table('currencies', function (Blueprint $table) {
            $table->dropColumn('rate_date');
        });
    }
};
