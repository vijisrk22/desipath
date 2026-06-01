<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('BuySellHomes', function (Blueprint $table) {
            $table->decimal('price_per_sqft', 10, 2)->nullable()->after('price');
            $table->integer('total_parking_spaces')->nullable()->after('lot_size');
            $table->boolean('attached_garage')->nullable()->after('total_parking_spaces');
            $table->boolean('community_pool')->nullable()->after('pool');
            $table->boolean('solar_setup')->nullable()->after('kitchen_granite_countertop');
            $table->integer('total_bathroom_total')->nullable()->after('full_bathroom_total');
        });
    }

    public function down()
    {
        Schema::table('BuySellHomes', function (Blueprint $table) {
            $table->dropColumn([
                'price_per_sqft',
                'total_parking_spaces',
                'attached_garage',
                'community_pool',
                'solar_setup',
                'total_bathroom_total',
            ]);
        });
    }
};
