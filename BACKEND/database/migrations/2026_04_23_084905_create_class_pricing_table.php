<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('class_pricing', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('class_id')->constrained('kids_classes')->cascadeOnDelete();
            $table->decimal('fee_amount', 10, 2)->nullable();
            $table->char('fee_currency', 3)->default('INR');
            $table->enum('fee_type', ['per_month', 'full_course', 'per_session'])->nullable();
            $table->text('discount_label')->nullable();
            $table->boolean('certificate_provided')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('class_pricing');
    }
};
