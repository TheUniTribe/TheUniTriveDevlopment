<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name', 100);                // e.g., "Laravel", "UI/UX Design"
            $table->string('category', 50)->nullable(); // e.g., "Programming", "Marketing"
            $table->timestamps();

            $table->unique(['user_id', 'name']);        // Prevent duplicates
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_skills');
    }
};