<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLocationstatecityzipTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('locationstatecityzip', function (Blueprint $table) {
            $table->id();
            $table->string('zip', 10);
            $table->string('city');
            $table->string('state_id')->nullable();
            $table->string('state_name')->nullable();
            $table->string('stateID_state_name')->nullable();
            $table->string('timezone')->nullable();
            $table->decimal('lat', 10, 6)->nullable();
            $table->decimal('lng', 10, 6)->nullable();
            $table->string('country')->default('USA');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locationstatecityzip');
    }
};
