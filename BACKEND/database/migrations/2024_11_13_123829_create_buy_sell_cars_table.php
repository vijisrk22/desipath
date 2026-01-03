<?php

// database/migrations/xxxx_xx_xx_create_buysellcars_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBuySellCarsTable extends Migration
{
    public function up()
    {
        Schema::create('BuySellCars', function (Blueprint $table) {
            $table->id();
            $table->string('make');
            $table->string('model');
            $table->integer('year');
            $table->integer('miles')->nullable();
            $table->string('variant')->nullable();
            $table->text('pictures')->nullable();
            $table->string('location');
            $table->foreignId('seller_id')->nullable()->constrained('users')->onDelete('set null');
            $table->decimal('price', 10, 2)->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('BuySellCars');
    }
}
