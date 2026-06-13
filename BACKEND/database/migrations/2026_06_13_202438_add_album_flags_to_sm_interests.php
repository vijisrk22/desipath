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
        Schema::table('sm_interests', function (Blueprint $table) {
            $table->boolean('sender_album_unlocked')->default(false);
            $table->boolean('receiver_album_unlocked')->default(false);
            $table->boolean('sender_requested_album')->default(false);
            $table->boolean('receiver_requested_album')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sm_interests', function (Blueprint $table) {
            $table->dropColumn([
                'sender_album_unlocked',
                'receiver_album_unlocked',
                'sender_requested_album',
                'receiver_requested_album'
            ]);
        });
    }
};
