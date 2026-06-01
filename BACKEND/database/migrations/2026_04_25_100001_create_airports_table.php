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
        Schema::create('airports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->char('iata_code', 3)->unique()->index();
            $table->char('icao_code', 4)->nullable();
            $table->string('airport_name', 255);
            $table->string('city', 100);
            $table->string('country', 100);
            $table->char('country_code', 2)->nullable();
            $table->string('region', 100)->nullable();
            $table->decimal('latitude', 9, 6)->nullable();
            $table->decimal('longitude', 9, 6)->nullable();
            $table->text('aliases')->nullable(); // Store as comma separated or JSON
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('airports');
    }
};
