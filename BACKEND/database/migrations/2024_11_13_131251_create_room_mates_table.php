<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRoomMatesTable extends Migration
{
    public function up()
    {
        Schema::create('RoomMates', function (Blueprint $table) {
            $table->id();
            $table->boolean('owner')->nullable();
            $table->boolean('agent')->nullable();
            $table->string('location_state', 100)->nullable();
            $table->string('location_city', 100)->nullable();
            $table->string('location_zipcode', 20)->nullable();
            $table->enum('sharing_type', ['Separate Room', 'Share the room with other person']);
            $table->boolean('kitchen_available')->nullable();
            $table->boolean('shared_bathroom')->nullable();
            $table->decimal('rent', 10, 2)->nullable();
            $table->enum('rent_frequency', ['Monthly', 'Daily', 'Weekly'])->nullable();
            $table->boolean('utilities_included')->nullable();
            $table->text('photos')->nullable();
            $table->date('available_from')->nullable();
            $table->date('available_to')->nullable();
            $table->enum('gender_preference', ['Male', 'Female', 'Any'])->nullable();
            $table->boolean('car_parking_available')->nullable();
            $table->enum('food_preference', ['Veg', 'Non Veg', 'Any'])->nullable();
            $table->boolean('washer_dryer')->nullable();
            $table->foreignId('poster_id')->nullable();
            $table->timestamps();
            
            // Foreign key constraint
            $table->foreign('poster_id')->references('id')->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('RoomMates');
    }
}

