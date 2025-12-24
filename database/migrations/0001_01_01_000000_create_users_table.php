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
        Schema::create('users', function (Blueprint $table) {
            // Primary identifier (SERIAL in PostgreSQL)
            $table->id();
            
            // Core authentication fields
            $table->string('username', 100)->unique();
            $table->string('email', 255)->unique();

            // Social login fields
            $table->string('provider')->nullable();
            $table->string('provider_id')->nullable();

            $table->string('password', 255);
            $table->timestamp('is_active')->nullable();
            $table->timestamp('is_verified')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            
            // Account security & recovery
            $table->string('password_reset_token', 255)->nullable();
            $table->timestamp('password_reset_expires')->nullable();
            $table->string('two_factor_secret', 255)->nullable();
            $table->boolean('two_factor_enabled')->default(false);
            
            // Account type and settings
            $table->string('account_type', 20)->default('basic');
            $table->string('account_status', 20)->default('active');
            $table->string('location', 50)->nullable();
            
            // Personal information
            $table->string('first_name', 100)->nullable();
            $table->string('last_name', 100)->nullable();
            $table->string('title', 255)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female', 'other', 'prefer_not_to_say'])->nullable();
            $table->string('phone', 20)->nullable();


            // Profile content
            $table->string('profile_pic', 255)->nullable(); // Increased for full URLs
            $table->text('bio')->nullable();
            $table->text('about')->nullable();
            $table->string('website_url', 255)->nullable(); // Increased for full URLs
            
            // Timestamps
            $table->timestamps();
             $table->rememberToken();
            // Indexes - PostgreSQL optimized
            $table->index('email');
            $table->index('username');
            $table->index('is_active');
            $table->index('created_at');
            $table->index(['is_active', 'is_verified']); // Composite index
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};