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
        Schema::create('community_tier_settings', function (Blueprint $table) {
            $table->id();
            $table->string('tier_name', 50)->unique(); // small, medium, large, enterprise
            $table->unsignedInteger('min_members');
            $table->unsignedInteger('max_members')->nullable();
            $table->string('label', 100);
            $table->string('icon', 50)->nullable();
            $table->string('color', 7)->nullable();
            $table->json('benefits')->nullable();
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('tier_name');
            $table->index('order');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('community_tier_settings');
    }
};
