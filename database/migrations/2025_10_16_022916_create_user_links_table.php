<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('platform', [
                'twitter', 'linkedin', 'instagram', 'facebook', 'youtube',
                'tiktok', 'github', 'website', 'custom'
            ]);
            $table->string('url', 512);
            $table->string('label')->nullable();        // used only if platform = 'custom'
            $table->boolean('is_public')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_links');
    }
};