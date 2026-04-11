<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCarAttributesTables extends Migration
{
    public function up()
    {
        // Master table: fuel types
        Schema::create('car_fuel_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g. EV, Gas, Hybrid, Diesel
            $table->timestamps();
        });

        // Master table: transmission types
        Schema::create('car_transmissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g. Manual, Automatic, CVT
            $table->timestamps();
        });

        // Master table: car conditions
        Schema::create('car_conditions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g. Excellent, Good, Average
            $table->timestamps();
        });

        // Add FK columns + owner_contact to BuySellCars
        Schema::table('BuySellCars', function (Blueprint $table) {
            $table->unsignedBigInteger('fuel_type_id')->nullable()->after('miles');
            $table->unsignedBigInteger('transmission_id')->nullable()->after('fuel_type_id');
            $table->unsignedBigInteger('condition_id')->nullable()->after('transmission_id');
            $table->string('owner_contact')->nullable()->after('description');

            $table->foreign('fuel_type_id')->references('id')->on('car_fuel_types')->onDelete('set null');
            $table->foreign('transmission_id')->references('id')->on('car_transmissions')->onDelete('set null');
            $table->foreign('condition_id')->references('id')->on('car_conditions')->onDelete('set null');
        });

        // Seed master tables with default values
        DB::table('car_fuel_types')->insert([
            ['name' => 'Gas',     'created_at' => now(), 'updated_at' => now()],
            ['name' => 'EV',      'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Hybrid',  'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Diesel',  'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('car_transmissions')->insert([
            ['name' => 'Automatic', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Manual',    'created_at' => now(), 'updated_at' => now()],
            ['name' => 'CVT',       'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('car_conditions')->insert([
            ['name' => 'Excellent', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Good',      'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Average',   'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down()
    {
        Schema::table('BuySellCars', function (Blueprint $table) {
            $table->dropForeign(['fuel_type_id']);
            $table->dropForeign(['transmission_id']);
            $table->dropForeign(['condition_id']);
            $table->dropColumn(['fuel_type_id', 'transmission_id', 'condition_id', 'owner_contact']);
        });

        Schema::dropIfExists('car_conditions');
        Schema::dropIfExists('car_transmissions');
        Schema::dropIfExists('car_fuel_types');
    }
}
