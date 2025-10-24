<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');

            // Profile basics
            $table->enum('gender', ['male', 'female', 'prefer_not_to_say'])->nullable();
            $table->string('designation')->nullable();        // e.g., "Full-Stack Developer"
            $table->text('bio')->nullable();               // Short bio
            $table->string('website_url')->nullable();
            $table->string('location')->nullable();        // e.g., "Berlin, Germany"
            $table->date('birthdate')->nullable();
            $table->timestamp('last_seen')->nullable();
            // Media
            $table->string('profile_photo', 2048)->nullable();

            // Cached stats (updated via events/observers)
            $table->unsignedBigInteger('followers_count')->default(0);
            $table->unsignedBigInteger('following_count')->default(0);
            $table->unsignedBigInteger('posts_count')->default(0);

            // Security
            $table->text('two_factor_secret')->nullable();
            $table->text('two_factor_recovery_codes')->nullable();
            $table->boolean('two_factor_enabled')->default(false);
            $table->date('is_banned')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};