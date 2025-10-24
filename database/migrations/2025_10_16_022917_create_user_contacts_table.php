<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['phone', 'email', 'telegram', 'whatsapp', 'signal', 'discord']);
            $table->string('value', 255);
            $table->boolean('is_public')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'type']); // One phone, one WhatsApp, etc.
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_contacts');
    }
};