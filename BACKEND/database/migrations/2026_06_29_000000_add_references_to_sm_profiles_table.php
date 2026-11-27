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
        Schema::table('sm_profiles', function (Blueprint $table) {
            $table->string('ref1_name')->nullable()->after('family_details');
            $table->string('ref1_location')->nullable()->after('ref1_name');
            $table->string('ref1_profession')->nullable()->after('ref1_location');
            $table->string('ref1_contact_number')->nullable()->after('ref1_profession');

            $table->string('ref2_name')->nullable()->after('ref1_contact_number');
            $table->string('ref2_location')->nullable()->after('ref2_name');
            $table->string('ref2_profession')->nullable()->after('ref2_location');
            $table->string('ref2_contact_number')->nullable()->after('ref2_profession');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sm_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'ref1_name',
                'ref1_location',
                'ref1_profession',
                'ref1_contact_number',
                'ref2_name',
                'ref2_location',
                'ref2_profession',
                'ref2_contact_number',
            ]);
        });
    }
};
