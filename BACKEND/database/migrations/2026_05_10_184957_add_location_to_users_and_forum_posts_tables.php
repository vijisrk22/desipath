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
        Schema::table('users', function (Blueprint $table) {
            $table->string('location')->nullable()->after('profile_photo');
        });

        Schema::table('forum_posts', function (Blueprint $table) {
            $table->string('location')->nullable()->after('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('location');
        });

        Schema::table('forum_posts', function (Blueprint $table) {
            $table->dropColumn('location');
        });
    }
};
