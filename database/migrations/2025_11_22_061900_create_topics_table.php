<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('topics', function (Blueprint $table) {
            $table->id();

            // Relationship
            $table->foreignId('interest_id')->constrained('interests');

            // Basic Information
            $table->string('name', 100);
            $table->string('slug', 100);
            $table->text('description')->nullable();

            // Visual Assets
            $table->string('icon')->nullable();

            // Engagement Metrics
            $table->unsignedInteger('members_count')->default(0);

            // Status
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            // Composite Unique Constraint
            $table->unique(['interest_id', 'slug']);

            // Useful Indexes
            $table->index(['interest_id', 'is_active']);
            $table->index('members_count');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('topics');
    }
};
