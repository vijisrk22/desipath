<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClassesForKidsAdsTable extends Migration
{
    public function up()
    {
        Schema::create('ClassesforKidsAds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable();
            $table->string('class_type', 255);
            $table->string('address', 255);
            $table->string('state', 100);
            $table->string('city', 100);
            $table->text('description')->nullable();
            $table->string('image', 255)->nullable();
            $table->date('start_date');
            $table->decimal('price', 10, 2)->nullable();
            $table->boolean('language_specific')->nullable();
            $table->string('language')->nullable(); // Modified for SQLite compatibility (was set)
            $table->text('contact_form')->nullable();
            $table->timestamp('timestamp')->useCurrent();
            $table->timestamps();
            
            // Adding the foreign key constraint manually
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('ClassesforKidsAds');
    }
}
