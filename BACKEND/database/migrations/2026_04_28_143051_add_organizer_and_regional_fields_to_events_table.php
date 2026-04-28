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
        Schema::table('events', function (Blueprint $table) {
            $table->string('organizer_name')->nullable();
            $table->string('organizer_contact')->nullable();
            $table->string('timezone')->nullable();
            $table->string('country')->nullable();
            $table->text('rules_regulations')->nullable();
            $table->json('tags')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['organizer_name', 'organizer_contact', 'timezone', 'country', 'rules_regulations', 'tags']);
        });
    }
};
