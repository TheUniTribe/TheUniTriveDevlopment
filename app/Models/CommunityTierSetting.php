<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommunityTierSetting extends Model
{
    protected $fillable = [
        'tier_name',
        'min_members',
        'max_members',
        'label',
        'icon',
        'color',
        'benefits',
        'order',
        'is_active',
    ];

    protected $casts = [
        'benefits' => 'array',
        'is_active' => 'boolean',
        'min_members' => 'integer',
        'max_members' => 'integer',
        'order' => 'integer',
    ];

    /**
     * Get tier for specific member count.
     */
    public static function getTierForMemberCount(int $count): ?self
    {
        return self::where('is_active', true)
            ->where('min_members', '<=', $count)
            ->where(function ($query) use ($count) {
                $query->whereNull('max_members')
                    ->orWhere('max_members', '>=', $count);
            })
            ->orderBy('order')
            ->first();
    }

    /**
     * Get all active tiers ordered.
     */
    public static function getActiveTiers()
    {
        return self::where('is_active', true)
            ->orderBy('order')
            ->get();
    }
}
