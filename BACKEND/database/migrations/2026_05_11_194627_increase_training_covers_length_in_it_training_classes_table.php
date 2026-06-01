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
        Schema::table('it_training_classes', function (Blueprint $table) {
            $table->text('training_covers')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('it_training_classes', function (Blueprint $table) {
            $table->string('training_covers', 70)->nullable()->change();
        });
    }
};
