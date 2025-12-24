<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interests', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->string('slug', 100)->unique();
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->string('color_class')->nullable();
            $table->string('cover_image')->nullable();

            // Metrics
            $table->boolean('is_trending')->default(false);
            $table->unsignedInteger('members_count')->default(0);

            // Status
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            // Indexes (removed redundant ones)
            $table->index('members_count'); // Only if you sort by popularity
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interests');
    }
};
