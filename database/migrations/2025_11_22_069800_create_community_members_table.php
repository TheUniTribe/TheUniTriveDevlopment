<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('community_members', function (Blueprint $table) {
            $table->id();

            /*
            |-----------------------------------------------
            | Core Relationships
            |-----------------------------------------------
            */
            $table->foreignId('community_id')->constrained('communities');
            $table->foreignId('user_id')->constrained('users');

            // Ensure one user can join a community only once
            $table->unique(['community_id', 'user_id']);

            /*
            |-----------------------------------------------
            | Membership Status
            |-----------------------------------------------
            */
            $table->enum('status', [
                'active',
                'pending',
                'suspended',
                'banned',
                'left'
            ])->default('pending');

            $table->timestamp('joined_at')->nullable();
            $table->timestamp('left_at')->nullable();

            /*
            |-----------------------------------------------
            | Approval Workflow
            |-----------------------------------------------
            */
            $table->timestamp('requested_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');

            $table->text('join_message')->nullable();
            $table->text('rejection_reason')->nullable();

            $table->timestamp('last_active_at')->nullable();

            /*
            |-----------------------------------------------
            | Member Level & XP
            |-----------------------------------------------
            */
            $table->unsignedInteger('member_level')->default(1);
            $table->unsignedBigInteger('member_xp')->default(0);

            $table->enum('member_rank', [
                'newbie',
                'regular',
                'veteran',
                'expert',
                'legend'
            ])->default('newbie');

            $table->json('member_badges')->nullable();

            /*
            |-----------------------------------------------
            | Notifications & Preferences
            |-----------------------------------------------
            */
            $table->boolean('notifications_enabled')->default(true);
            $table->boolean('email_notifications')->default(true);

            /*
            |-----------------------------------------------
            | Moderation & Safety
            |-----------------------------------------------
            */
            $table->boolean('is_muted')->default(false);
            $table->timestamp('muted_until')->nullable();
            $table->text('mute_reason')->nullable();

            $table->boolean('is_banned')->default(false);
            $table->timestamp('banned_at')->nullable();
            $table->foreignId('banned_by')->nullable()->constrained('users');
            $table->text('ban_reason')->nullable();

            $table->unsignedInteger('warnings_count')->default(0);
            $table->json('warning_history')->nullable();

            /*
            |-----------------------------------------------
            | Invitation & Referral
            |-----------------------------------------------
            */
            $table->foreignId('invited_by')->nullable()->constrained('users');
            $table->string('invite_code_used')->nullable();
            $table->unsignedInteger('members_invited')->default(0);

            /*
            |-----------------------------------------------
            | Contribution Metrics
            |-----------------------------------------------
            */
            $table->unsignedInteger('helpful_votes_received')->default(0);
            $table->decimal('contribution_score', 8, 2)->default(0.00);
            $table->boolean('is_top_contributor')->default(false);

            /*
            |-----------------------------------------------
            | Timestamps
            |-----------------------------------------------
            */
            $table->timestamps();

            /*
            |-----------------------------------------------
            | Indexes for Performance
            |-----------------------------------------------
            */
            $table->index(['community_id', 'status']);
            $table->index('last_active_at');
            $table->index('is_top_contributor');
            $table->index(['community_id', 'contribution_score']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('community_members');
    }
};
