<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('communities', function (Blueprint $table) {
            $table->id();

            /*
            |-----------------------------------------------
            | Hierarchy & Organization
            |-----------------------------------------------
            */
            $table->foreignId('parent_id')->nullable()->constrained('communities');

            /*
            |-----------------------------------------------
            | Core Identity
            |-----------------------------------------------
            */
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->text('description');
            $table->text('rules')->nullable();
            $table->text('about')->nullable();

            /*
            |-----------------------------------------------
            | Community Classification
            |-----------------------------------------------
            */
            $table->enum('type', ['professional', 'student'])->default('student');

            /*
            |-----------------------------------------------
            | Membership Management
            |-----------------------------------------------
            */
            $table->boolean('require_manual_approval')->default(true);
            $table->text('eligibility_criteria')->nullable();
            $table->json('verification_questions')->nullable();

            $table->unsignedInteger('max_members')->nullable();
            $table->unsignedInteger('active_members_count')->default(0);
            $table->unsignedInteger('pending_members_count')->default(0);

            /*
            |-----------------------------------------------
            | Creator & Ownership
            |-----------------------------------------------
            */
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('owner_id')->nullable()->constrained('users');



            /*
            |-----------------------------------------------
            | Status & Lifecycle
            |-----------------------------------------------
            */
            $table->enum('status', [
                'draft',
                'pending_review',
                'published',
                'rejected',
                'suspended',
                'archived'
            ])->default('draft');

            $table->timestamp('published_at')->nullable();
            $table->timestamp('last_activity_at')->nullable();


            /*
            |-----------------------------------------------
            | Approval & Moderation Workflow
            |-----------------------------------------------
            */
            $table->timestamp('submitted_for_review_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->text('rejection_reason')->nullable();
            $table->unsignedInteger('revision_count')->default(0);

            /*
            |-----------------------------------------------
            | Access Control & Privacy
            |-----------------------------------------------
            */
            $table->enum('visibility', [
                'public',
                'private',
                'unlisted',
                'invite_only'
            ])->default('public');

            $table->enum('join_policy', [
                'open',
                'request',
                'invite',
                'application',
                'referral_required'
            ])->default('request');

            $table->enum('content_visibility', [
                'public',
                'members_only',
                'verified_members_only'
            ])->default('members_only');

            /*
            |-----------------------------------------------
            | Industry & Professional Info
            |-----------------------------------------------
            */
            $table->boolean('require_linkedin_verification')->default(false);

            /*
            |-----------------------------------------------
            | Visual Branding & Assets
            |-----------------------------------------------
            */
            $table->string('avatar', 255)->nullable();
            $table->string('cover_image', 255)->nullable();
            $table->string('logo', 255)->nullable();
            $table->string('badge', 50)->nullable();
            $table->string('badge_color', 7)->nullable();
            $table->string('theme_color', 7)->nullable();
            $table->json('custom_theme')->nullable();

            /*
            |-----------------------------------------------
            | Member Experience & Engagement
            |-----------------------------------------------
            */
            $table->text('welcome_message')->nullable();
            $table->json('faqs')->nullable();

            /*
            |-----------------------------------------------
            | Engagement Metrics
            |-----------------------------------------------
            */
            $table->unsignedInteger('total_posts')->default(0);
            $table->unsignedInteger('total_comments')->default(0);
            $table->unsignedInteger('total_likes')->default(0);
            $table->unsignedInteger('total_shares')->default(0);
            $table->unsignedInteger('total_views')->default(0);

            $table->unsignedInteger('posts_today')->default(0);
            $table->unsignedInteger('posts_this_week')->default(0);
            $table->unsignedInteger('posts_this_month')->default(0);

            $table->decimal('engagement_rate', 5, 2)->default(0);
            $table->decimal('growth_rate', 5, 2)->default(0);
            $table->unsignedInteger('daily_active_users')->default(0);
            $table->unsignedInteger('weekly_active_users')->default(0);
            $table->unsignedInteger('monthly_active_users')->default(0);



            /*
            |-----------------------------------------------
            | Administrative Controls
            |-----------------------------------------------
            */
            $table->boolean('is_verified')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->string('verification_badge_type', 50)->nullable();


            /*
            |-----------------------------------------------
            | Warnings & Strikes System
            |-----------------------------------------------
            */
            $table->unsignedInteger('warning_count')->default(0);
            $table->unsignedInteger('strike_count')->default(0);
            $table->timestamp('last_warning_at')->nullable();
            $table->timestamp('last_strike_at')->nullable();
            $table->json('warning_history')->nullable();

            /*
            |-----------------------------------------------
            | Gamification & Rewards
            |-----------------------------------------------
            */
            $table->unsignedInteger('level')->default(1);
            $table->unsignedBigInteger('experience_points')->default(0);
            $table->unsignedBigInteger('xp_required_for_next_level')->default(1000);

            $table->enum('rank', [
                'newcomer',
                'rising',
                'established',
                'prominent',
                'elite',
                'legendary',
                'hall_of_fame'
            ])->default('newcomer');

            $table->timestamp('last_level_up_at')->nullable();
            $table->unsignedInteger('total_level_ups')->default(0);
            $table->unsignedInteger('streak_days')->default(0);
            $table->unsignedInteger('longest_streak')->default(0);
            $table->timestamp('streak_started_at')->nullable();

            $table->json('earned_badges')->nullable();
            $table->json('achievements')->nullable();
            $table->json('rank_rewards')->nullable();
            $table->json('leaderboard_positions')->nullable();

            $table->unsignedInteger('reputation_score')->default(0);
            $table->unsignedInteger('contribution_points')->default(0);
            $table->unsignedInteger('influence_score')->default(0);

            /*
            |-----------------------------------------------
            | Special Badges & Certifications
            |-----------------------------------------------
            */
            $table->boolean('verified_badge_unlocked')->default(false);
            $table->timestamp('verified_badge_earned_at')->nullable();
            $table->boolean('partner_badge')->default(false);
            $table->boolean('official_badge')->default(false);
            $table->boolean('certified_badge')->default(false);
            $table->boolean('trending_badge')->default(false);
            $table->boolean('recommended_badge')->default(false);

            /*
            |-----------------------------------------------
            | Integration & API
            |-----------------------------------------------
            */
            $table->string('webhook_url')->nullable();
            $table->json('api_settings')->nullable();
            $table->json('integration_tokens')->nullable();
            $table->boolean('enable_api_access')->default(false);

            /*
            |-----------------------------------------------
            | Compliance & Legal
            |-----------------------------------------------
            */
            $table->text('terms_of_service')->nullable();
            $table->text('privacy_policy')->nullable();

            /*
            |-----------------------------------------------
            | AI & Automation
            |-----------------------------------------------
            */
            $table->boolean('enable_ai_moderation')->default(false);
            $table->boolean('enable_ai_recommendations')->default(true);
            $table->boolean('enable_smart_replies')->default(false);
            $table->json('ai_settings')->nullable();

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
            $table->index('type');
            $table->index('status');
            $table->index('visibility');
            $table->index('join_policy');
            $table->index('level');
            $table->index('rank');
            $table->index('reputation_score');
            $table->index('engagement_rate');
            $table->index('active_members_count');
            $table->index('last_activity_at');
            $table->index('published_at');
            $table->index('created_at');

            // Composite indexes
            $table->index(['type', 'status', 'visibility']);
            $table->index(['status', 'is_verified']);
            $table->index(['level', 'rank']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('communities');
    }
};
