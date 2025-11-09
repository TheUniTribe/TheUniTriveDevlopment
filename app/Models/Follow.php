<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Follow extends Model
{
    protected $fillable = [
        'follower_id',
        'followed_id',
        'is_accepted',
        'blocked_at',
        'visibility',
        'is_muted',
        'notifications_enabled',
        'source',
    ];

    protected $casts = [
        'is_accepted' => 'boolean',
        'blocked_at' => 'datetime',
        'is_muted' => 'boolean',
        'notifications_enabled' => 'boolean',
    ];

    /**
     * Get the user who is following.
     */
    public function follower(): BelongsTo
    {
        return $this->belongsTo(User::class, 'follower_id');
    }

    /**
     * Get the user being followed.
     */
    public function followed(): BelongsTo
    {
        return $this->belongsTo(User::class, 'followed_id');
    }
}
