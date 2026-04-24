<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('class_enquiries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('class_id')->constrained('kids_classes')->cascadeOnDelete();
            $table->foreignUuid('instructor_id')->constrained('instructors')->cascadeOnDelete();
            $table->string('enquirer_name', 255)->nullable();
            $table->string('enquirer_phone', 20)->nullable();
            $table->text('message')->nullable();
            $table->boolean('email_sent')->default(false);
            $table->timestamp('email_sent_at')->nullable();
            $table->timestamps();
            
            $table->index('class_id');
            $table->index('created_at');
        });
    }

    public function down(): void {
        Schema::dropIfExists('class_enquiries');
    }
};
