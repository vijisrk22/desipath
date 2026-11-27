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
        Schema::table('TravelCompanions', function (Blueprint $table) {
            if (!Schema::hasColumn('TravelCompanions', 'status')) {
                $table->string('status')->default('active')->after('poster_id');
            }
        });

        DB::table('TravelCompanions')->whereNull('status')->update(['status' => 'active']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('TravelCompanions', function (Blueprint $table) {
            if (Schema::hasColumn('TravelCompanions', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
};
