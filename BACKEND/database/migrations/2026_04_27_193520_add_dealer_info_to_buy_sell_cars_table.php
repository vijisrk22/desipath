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
            $table->boolean('is_dealer')->default(false)->after('description');
            $table->string('dealer_name')->nullable()->after('is_dealer');
            $table->string('dealer_zipcode')->nullable()->after('dealer_name');
            $table->string('dealer_contact_person')->nullable()->after('dealer_zipcode');
            $table->string('dealer_contact_number')->nullable()->after('dealer_contact_person');
            $table->string('dealer_email')->nullable()->after('dealer_contact_number');
            $table->string('owner_name')->nullable()->after('dealer_email');
            $table->string('owner_contact_number')->nullable()->after('owner_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('BuySellCars', function (Blueprint $table) {
            $table->dropColumn([
                'is_dealer', 'dealer_name', 'dealer_zipcode', 
                'dealer_contact_person', 'dealer_contact_number', 
                'dealer_email', 'owner_name', 'owner_contact_number'
            ]);
        });
    }
};
