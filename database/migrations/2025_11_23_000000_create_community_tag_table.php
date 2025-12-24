<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('community_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('community_id')
                ->constrained('communities');
            $table->foreignId('tag_id')
                ->constrained('tags');
            $table->timestamps();

            // Ensure unique combinations
            $table->unique(['community_id', 'tag_id']);

            // Indexes for performance
            $table->index('community_id');
            $table->index('tag_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('community_tag');
    }
};
