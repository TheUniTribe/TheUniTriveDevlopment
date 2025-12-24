<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * CommunityMember Model
 *
 * Represents a user's membership in a community.
 *
 * @property int $id
 * @property int $community_id
 * @property int $user_id
 * @property string $status
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 *
 * @property-read \App\Models\Community $community
 * @property-read \App\Models\User $user
 */
class CommunityMember extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'community_members';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'community_id',
        'user_id',
        'status',
        'joined_at',
        'left_at',
        'requested_at',
        'approved_at',
        'approved_by',
        'join_message',
        'rejection_reason',
        'last_active_at',
        'member_level',
        'member_xp',
        'member_rank',
        'member_badges',
        'notifications_enabled',
        'email_notifications',
        'is_muted',
        'muted_until',
        'mute_reason',
        'is_banned',
        'banned_at',
        'banned_by',
        'ban_reason',
        'warnings_count',
        'warning_history',
        'invited_by',
        'invite_code_used',
        'members_invited',
        'helpful_votes_received',
        'contribution_score',
        'is_top_contributor',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'community_id' => 'integer',
        'user_id' => 'integer',
        'approved_by' => 'integer',
        'banned_by' => 'integer',
        'invited_by' => 'integer',
        'member_level' => 'integer',
        'member_xp' => 'integer',
        'warnings_count' => 'integer',
        'members_invited' => 'integer',
        'helpful_votes_received' => 'integer',
        'contribution_score' => 'decimal:2',
        'joined_at' => 'datetime',
        'left_at' => 'datetime',
        'requested_at' => 'datetime',
        'approved_at' => 'datetime',
        'last_active_at' => 'datetime',
        'muted_until' => 'datetime',
        'banned_at' => 'datetime',
        'member_badges' => 'array',
        'warning_history' => 'array',
        'notifications_enabled' => 'boolean',
        'email_notifications' => 'boolean',
        'is_muted' => 'boolean',
        'is_banned' => 'boolean',
        'is_top_contributor' => 'boolean',
    ];

    /**
     * Get the community that this membership belongs to
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    /**
     * Get the user that this membership belongs to
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Add a new community member record
     *
     * @param array $data
     * @return int
     */
    public function add(array $data): int
    {
        return $this->insertGetId($data);
    }

    /**
     * Modify an existing community member record
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
     * Remove a community member record
     *
     * @param int $id
     * @return int
     */
    public function remove(int $id): int
    {
        return $this->where('id', $id)->delete();
    }
}
