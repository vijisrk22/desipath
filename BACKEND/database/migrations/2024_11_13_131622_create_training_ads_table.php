<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrainingAdsTable extends Migration
{
    public function up()
    {
        Schema::create('TrainingAds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable();
            $table->string('course_title');
            $table->decimal('course_fee', 10, 2)->nullable();
            $table->text('agenda')->nullable();
            $table->string('image_1')->nullable();
            $table->string('image_2')->nullable();
            $table->string('image_3')->nullable();
            $table->text('contact_form')->nullable();
            $table->timestamp('timestamp')->nullable()->useCurrent();
            $table->datetime('created_at')->nullable();
            $table->datetime('updated_at')->nullable();

            // Foreign key constraint
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('TrainingAds');
    }
}
