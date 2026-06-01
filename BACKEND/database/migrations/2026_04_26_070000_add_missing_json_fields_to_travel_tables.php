<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('travel_requests', function (Blueprint $table) {
            if (!Schema::hasColumn('travel_requests', 'comfortable_helping')) {
                $table->json('comfortable_helping')->nullable()->after('special_needs');
            }
        });

        Schema::table('volunteer_posts', function (Blueprint $table) {
            if (!Schema::hasColumn('volunteer_posts', 'special_needs')) {
                $table->json('special_needs')->nullable()->after('prior_experience');
            }
        });
    }

    public function down(): void
    {
        Schema::table('travel_requests', function (Blueprint $table) {
            $table->dropColumn('comfortable_helping');
        });

        Schema::table('volunteer_posts', function (Blueprint $table) {
            $table->dropColumn('special_needs');
        });
    }
};
