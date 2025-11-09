<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFollowsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('follows', function (Blueprint $table) {
            // Primary key
            $table->bigIncrements('id');

            // Relationship columns
            $table->unsignedBigInteger('follower_id');  // user who follows
            $table->unsignedBigInteger('followed_id');  // user being followed

            // Metadata fields
            $table->boolean('is_accepted')->default(true); // for private accounts
            $table->timestamp('blocked_at')->nullable();   // when user was blocked
            $table->enum('visibility', ['public', 'friends_only'])->default('public');

            // Optional helpful flags
            $table->boolean('is_muted')->default(false);
            $table->boolean('notifications_enabled')->default(true);
            $table->string('source', 50)->nullable(); // e.g. 'suggestion', 'import', 'manual'

            // Auto timestamps (created_at, updated_at)
            $table->timestamps();

            // Uniqueness: no duplicate follows
            $table->unique(['follower_id', 'followed_id'], 'follows_unique_follower_followed');

            // Indexes for fast lookups
            $table->index(['followed_id', 'created_at'], 'idx_follows_followed_created_at');
            $table->index(['follower_id', 'created_at'], 'idx_follows_follower_created_at');
            $table->index('blocked_at', 'idx_follows_blocked_at');

            // Foreign keys (assuming users.id exists)
            $table->foreign('follower_id')
                  ->references('id')->on('users')
                  ->onDelete('cascade');

            $table->foreign('followed_id')
                  ->references('id')->on('users')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('follows', function (Blueprint $table) {
            $table->dropForeign(['follower_id']);
            $table->dropForeign(['followed_id']);
        });

        Schema::dropIfExists('follows');
    }
}
