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
        Schema::create('business_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('business_name');
            $table->string('category');
            $table->string('owner_name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('city');
            $table->string('state_province');
            $table->string('country');
            $table->string('website_url')->nullable();
            $table->text('bio')->nullable();
            $table->string('logo_url')->nullable();
            $table->enum('account_status', ['pending', 'active', 'suspended'])->default('pending');
            $table->timestamp('activated_at')->nullable();
            $table->timestamps();
        });

        Schema::create('local_ads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_account_id')->constrained('business_accounts')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->json('tags')->nullable();
            $table->string('category');
            $table->json('poster_urls'); // Array of image URLs
            $table->string('location_city');
            $table->string('location_state')->nullable();
            $table->string('country');
            $table->string('website_url')->nullable();
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected', 'expired', 'suspended'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('renewed_at')->nullable();
            $table->integer('view_count')->default(0);
            $table->integer('popup_open_count')->default(0);
            $table->integer('message_click_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('local_ads');
        Schema::dropIfExists('business_accounts');
    }
};
