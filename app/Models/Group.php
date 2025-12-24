<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'about',
        'type',
        'parent_id',
        'owner_id',
        'visibility',
        'join_policy',
        'group_rank',
        'is_trending',
        'ranking_metrics',
        'avatar',
        'banner',
        'settings',
        'member_count',
        'post_count',
        'resource_count',
        'is_active',
        'last_activity_at',
    ];

    protected $casts = [
        'parent_id' => 'integer',
        'owner_id' => 'integer',
        'group_rank' => 'decimal:2',
        'is_trending' => 'boolean',
        'ranking_metrics' => 'array',
        'settings' => 'array',
        'member_count' => 'integer',
        'post_count' => 'integer',
        'resource_count' => 'integer',
        'is_active' => 'boolean',
        'last_activity_at' => 'datetime',
    ];

    /**
     * Get the parent group.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Group::class, 'parent_id');
    }

    /**
     * Get the child groups.
     */
    public function children(): HasMany
    {
        return $this->hasMany(Group::class, 'parent_id');
    }

    /**
     * Get the owner of the group.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get the tags for the group.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'group_tag');
    }

    /**
     * Scope a query to only include active groups.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include public groups.
     */
    public function scopePublic($query)
    {
        return $query->where('visibility', 'public');
    }

    /**
     * Scope a query to order by group_rank.
     */
    public function scopeRanked($query)
    {
        return $query->orderBy('group_rank', 'desc');
    }
}
