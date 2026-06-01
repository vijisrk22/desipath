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
        Schema::table('RoomMates', function (Blueprint $table) {
            if (!Schema::hasColumn('RoomMates', 'address')) {
                $table->string('address')->nullable();
            }
            if (!Schema::hasColumn('RoomMates', 'is_furnished')) {
                $table->boolean('is_furnished')->default(false); // true for Furnished, false for Unfurnished
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('RoomMates', function (Blueprint $table) {
            $table->dropColumn(['address', 'is_furnished']);
        });
    }
};
