<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->id();

            $table->string('name', 100);
            $table->string('slug', 100);
            $table->string('icon', 10)->nullable();
            $table->text('description')->nullable();

            // Metrics
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('usage_count')->default(0);

            $table->timestamps();
            $table->index('slug');
            $table->index('is_active');
            $table->index('usage_count');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tags');
    }
};
