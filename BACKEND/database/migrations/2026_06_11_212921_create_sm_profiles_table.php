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
        Schema::create('sm_profiles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique();
            $table->string('display_name')->nullable();
            $table->date('dob')->nullable();
            $table->string('gender')->nullable();
            $table->string('community')->nullable();
            $table->string('religion')->nullable();
            $table->string('education')->nullable();
            $table->string('profession')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->string('residency_tier')->nullable(); // CITIZEN, PR, WORK_VISA, STUDENT, OTHER
            $table->integer('trust_score')->default(0);
            $table->text('about_me')->nullable();
            $table->string('voice_note_url')->nullable();
            $table->text('family_details')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('status')->default('active'); // active, inactive, reported
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sm_profiles');
    }
};
