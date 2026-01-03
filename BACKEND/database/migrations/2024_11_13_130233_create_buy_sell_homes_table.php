<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('BuySellHomes', function (Blueprint $table) {
            $table->id();
            $table->enum('user_type', ['Agent', 'Owner']);
            $table->enum('home_type', ['Condominum', 'Single family', 'Town home']);
            $table->decimal('price', 10, 2);
            $table->decimal('built_area', 10, 2)->nullable();
            $table->decimal('lot_size', 10, 2)->nullable();
            $table->decimal('hoa_fees', 10, 2)->nullable();
            $table->integer('year_built')->nullable();
            $table->boolean('under_construction')->nullable();
            $table->integer('bedroom_total')->nullable();
            $table->integer('half_bathroom_total')->nullable();
            $table->integer('full_bathroom_total')->nullable();
            $table->decimal('basement_size', 10, 2)->nullable();
            $table->enum('basement_status', ['Finished', 'Unfinished', 'Semi finished'])->nullable();
            $table->boolean('laundry_in_house')->nullable();
            $table->integer('home_level')->nullable();
            $table->boolean('pool')->nullable();
            $table->decimal('annual_tax_amount', 10, 2)->nullable();
            $table->text('images')->nullable();
            $table->string('description', 2000)->nullable();
            $table->boolean('kitchen_granite_countertop')->nullable();
            $table->integer('fireplace_count')->nullable();
            $table->string('flooring')->nullable(); // Modified for SQLite compatibility (was set)
            $table->unsignedBigInteger('seller_id')->nullable();
            $table->timestamps();

            $table->foreign('seller_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('BuySellHomes');
    }
};
