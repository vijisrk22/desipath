<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRentalHomesTable extends Migration
{
    public function up()
    {
        Schema::create('RentalHomes', function (Blueprint $table) {
            $table->id();
            $table->enum('property_type', ['Single family Home', 'Apartment', 'Condo', 'Basement Apartment']);
            $table->date('available_from');
            $table->decimal('area', 10, 2)->nullable();
            $table->decimal('deposit_rent', 10, 2)->nullable();
            $table->enum('bhk', ['1 Bed 1 Bath', '2 Bed 2 Bath', '2 Bed 1 Bath', '3 Bed 3 Bath', '3 Bed 2 Bath', '4 Bed 4 Bath', '4 Bed 3 Bath', '4 Bed 2 Bath']);
            $table->string('address', 255);
            $table->string('community_name', 255)->nullable();
            $table->string('amenities')->nullable(); // Modified for SQLite compatibility (was set)
            $table->boolean('pets')->nullable();
            $table->text('images')->nullable();
            $table->integer('accommodates')->nullable();
            $table->enum('smoking', ['Ok', 'Not okay']);
            $table->foreignId('owner_id')->nullable();
            $table->timestamps();
            
            // Foreign key constraint
            $table->foreign('owner_id')->references('id')->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('RentalHomes');
    }
}
