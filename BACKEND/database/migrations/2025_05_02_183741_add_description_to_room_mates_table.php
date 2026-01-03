<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDescriptionToRoomMatesTable extends Migration
{
    public function up()
    {
        Schema::table('RoomMates', function (Blueprint $table) {
            $table->text('description')->nullable(); // Add description field
        });
    }

    public function down()
    {
        Schema::table('RoomMates', function (Blueprint $table) {
            $table->dropColumn('description'); // Drop description field if rolled back
        });
    }
}
