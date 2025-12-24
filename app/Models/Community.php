<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Community Model
 *
 * Represents a community where users can interact around shared interests.
 *
 * @property int $id
 * @property int|null $parent_id
 * @property string $name
 * @property string $slug
 * @property string $description
 * @property string|null $rules
 * @property string|null $about
 * @property string $type
 * @property bool $require_manual_approval
 * @property string|null $eligibility_criteria
 * @property array|null $verification_questions
 * @property int|null $max_members
 * @property int $active_members_count
 * @property int $pending_members_count
 * @property int $created_by
 * @property int|null $owner_id
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $published_at
 * @property \Illuminate\Support\Carbon|null $last_activity_at
 * @property \Illuminate\Support\Carbon|null $submitted_for_review_at
 * @property \Illuminate\Support\Carbon|null $approved_at
 * @property int|null $approved_by
 * @property string|null $rejection_reason
 * @property int $revision_count
 * @property string $visibility
 * @property string $join_policy
 * @property string $content_visibility
 * @property bool $require_linkedin_verification
 * @property string|null $avatar
 * @property string|null $cover_image
 * @property string|null $logo
 * @property string|null $badge
 * @property string|null $badge_color
 * @property string|null $theme_color
 * @property array|null $custom_theme
 * @property string|null $welcome_message
 * @property array|null $faqs
 * @property int $total_posts
 * @property int $total_comments
 * @property int $total_likes
 * @property int $total_shares
 * @property int $total_views
 * @property int $posts_today
 * @property int $posts_this_week
 * @property int $posts_this_month
 * @property float $engagement_rate
 * @property float $growth_rate
 * @property int $daily_active_users
 * @property int $weekly_active_users
 * @property int $monthly_active_users
 * @property bool $is_verified
 * @property \Illuminate\Support\Carbon|null $verified_at
 * @property string|null $verification_badge_type
 * @property int $warning_count
 * @property int $strike_count
 * @property \Illuminate\Support\Carbon|null $last_warning_at
 * @property \Illuminate\Support\Carbon|null $last_strike_at
 * @property array|null $warning_history
 * @property int $level
 * @property int $experience_points
 * @property int $xp_required_for_next_level
 * @property string $rank
 * @property \Illuminate\Support\Carbon|null $last_level_up_at
 * @property int $total_level_ups
 * @property int $streak_days
 * @property int $longest_streak
 * @property \Illuminate\Support\Carbon|null $streak_started_at
 * @property array|null $earned_badges
 * @property array|null $achievements
 * @property array|null $rank_rewards
 * @property array|null $leaderboard_positions
 * @property int $reputation_score
 * @property int $contribution_points
 * @property int $influence_score
 * @property bool $verified_badge_unlocked
 * @property \Illuminate\Support\Carbon|null $verified_badge_earned_at
 * @property bool $partner_badge
 * @property bool $official_badge
 * @property bool $certified_badge
 * @property bool $trending_badge
 * @property bool $recommended_badge
 * @property string|null $webhook_url
 * @property array|null $api_settings
 * @property array|null $integration_tokens
 * @property bool $enable_api_access
 * @property string|null $terms_of_service
 * @property string|null $privacy_policy
 * @property bool $enable_ai_moderation
 * @property bool $enable_ai_recommendations
 * @property bool $enable_smart_replies
 * @property array|null $ai_settings
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 *
 * @property-read \App\Models\Community|null $parent
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Community[] $subCommunities
 * @property-read \App\Models\User $creator
 * @property-read \App\Models\User|null $owner
 * @property-read \App\Models\User|null $approver
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Topic[] $topics
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\User[] $members
 */
class Community extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        // Hierarchy & Organization
        'parent_id',

        // Core Identity
        'name',
        'slug',
        'description',
        'rules',
        'about',

        // Community Classification
        'type',

        // Membership Management
        'require_manual_approval',
        'eligibility_criteria',
        'verification_questions',
        'max_members',
        'active_members_count',
        'pending_members_count',

        // Creator & Ownership
        'created_by',
        'owner_id',



        // Status & Lifecycle
        'status',
        'published_at',
        'last_activity_at',
        'submitted_for_review_at',
        'approved_at',
        'approved_by',
        'rejection_reason',
        'revision_count',


        // Access Control & Privacy
        'visibility',
        'join_policy',
        'content_visibility',

        // Industry & Professional Info
        'require_linkedin_verification',

        // Visual Branding & Assets
        'avatar',
        'cover_image',
        'logo',
        'badge',
        'badge_color',
        'theme_color',
        'custom_theme',

        // Member Experience & Engagement
        'welcome_message',
        'faqs',

        // Engagement Metrics
        'total_posts',
        'total_comments',
        'total_likes',
        'total_shares',
        'total_views',
        'posts_today',
        'posts_this_week',
        'posts_this_month',
        'engagement_rate',
        'growth_rate',
        'daily_active_users',
        'weekly_active_users',
        'monthly_active_users',



        // Administrative Controls
        'is_verified',
        'verified_at',
        'verification_badge_type',


        // Warnings & Strikes System
        'warning_count',
        'strike_count',
        'last_warning_at',
        'last_strike_at',
        'warning_history',

        // Gamification & Rewards
        'level',
        'experience_points',
        'xp_required_for_next_level',
        'rank',
        'last_level_up_at',
        'total_level_ups',
        'streak_days',
        'longest_streak',
        'streak_started_at',
        'earned_badges',
        'achievements',
        'rank_rewards',
        'leaderboard_positions',
        'reputation_score',
        'contribution_points',
        'influence_score',

        // Special Badges & Certifications
        'verified_badge_unlocked',
        'verified_badge_earned_at',
        'partner_badge',
        'official_badge',
        'certified_badge',
        'trending_badge',
        'recommended_badge',

        // Integration & API
        'webhook_url',
        'api_settings',
        'integration_tokens',
        'enable_api_access',

        // Compliance & Legal
        'terms_of_service',
        'privacy_policy',

        // AI & Automation
        'enable_ai_moderation',
        'enable_ai_recommendations',
        'enable_smart_replies',
        'ai_settings',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        // JSON Arrays
        'verification_questions' => 'array',
        'custom_theme' => 'array',
        'faqs' => 'array',
        'earned_badges' => 'array',
        'achievements' => 'array',
        'rank_rewards' => 'array',
        'leaderboard_positions' => 'array',
        'ai_settings' => 'array',
        'warning_history' => 'array',
        'api_settings' => 'array',
        'integration_tokens' => 'array',

        // Booleans
        'require_manual_approval' => 'boolean',
        'require_linkedin_verification' => 'boolean',
        'is_verified' => 'boolean',
        'verified_badge_unlocked' => 'boolean',
        'partner_badge' => 'boolean',
        'official_badge' => 'boolean',
        'certified_badge' => 'boolean',
        'trending_badge' => 'boolean',
        'recommended_badge' => 'boolean',
        'enable_api_access' => 'boolean',
        'enable_ai_moderation' => 'boolean',
        'enable_ai_recommendations' => 'boolean',
        'enable_smart_replies' => 'boolean',

        // Decimals
        'engagement_rate' => 'decimal:2',
        'growth_rate' => 'decimal:2',

        // Integers
        'active_members_count' => 'integer',
        'pending_members_count' => 'integer',
        'revision_count' => 'integer',
        'max_members' => 'integer',
        'total_posts' => 'integer',
        'total_comments' => 'integer',
        'total_likes' => 'integer',
        'total_shares' => 'integer',
        'total_views' => 'integer',
        'posts_today' => 'integer',
        'posts_this_week' => 'integer',
        'posts_this_month' => 'integer',
        'daily_active_users' => 'integer',
        'weekly_active_users' => 'integer',
        'monthly_active_users' => 'integer',
        'warning_count' => 'integer',
        'strike_count' => 'integer',
        'level' => 'integer',
        'experience_points' => 'integer',
        'xp_required_for_next_level' => 'integer',
        'total_level_ups' => 'integer',
        'streak_days' => 'integer',
        'longest_streak' => 'integer',
        'reputation_score' => 'integer',
        'contribution_points' => 'integer',
        'influence_score' => 'integer',

        // Timestamps
        'published_at' => 'datetime',
        'last_activity_at' => 'datetime',
        'submitted_for_review_at' => 'datetime',
        'approved_at' => 'datetime',
        'verified_at' => 'datetime',
        'last_warning_at' => 'datetime',
        'last_strike_at' => 'datetime',
        'last_level_up_at' => 'datetime',
        'streak_started_at' => 'datetime',
        'verified_badge_earned_at' => 'datetime',
    ];

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate slug from name if not provided
        static::creating(function ($community) {
            if (empty($community->slug)) {
                $community->slug = Str::slug($community->name);
            }
        });
    }

    /**
     * Get the parent community
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function parent()
    {
        return $this->belongsTo(Community::class, 'parent_id');
    }

    /**
     * Get all sub-communities
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function subCommunities()
    {
        return $this->hasMany(Community::class, 'parent_id');
    }

    /**
     * Get the creator of this community
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the owner of this community
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get the approver of this community
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get all topics for this community (many-to-many)
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function topics()
    {
        return $this->belongsToMany(Topic::class, 'community_topic')
            ->withTimestamps();
    }


    /* Get all membership records
    *
    * @return \Illuminate\Database\Eloquent\Relations\HasMany
    */
    public function members()
    {
        return $this->hasMany(CommunityMember::class);
    }

    /**
     * Add a new community record
     *
     * @param array $data
     * @return int
     */
    public function add(array $data): int
    {
        return $this->insertGetId($data);
    }

    /**
     * Modify an existing community record
     *
     * @param int $id
     * @param array $data
     * @return int
     */
    public function modify(int $id, array $data): int
    {
        return $this->where('id', $id)->update($data);
    }

    /**
     * Remove a community record
     *
     * @param int $id
     * @return int
     */
    public function remove(int $id): int
    {
        return $this->where('id', $id)->delete();
    }
}
