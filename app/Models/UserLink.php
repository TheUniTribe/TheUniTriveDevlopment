<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserLink extends Model
{
    use HasFactory;

    protected $table = 'user_links';

    protected $fillable = [
        'user_id',
        'platform',
        'url',
        'label',
        'is_public',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getDisplayLabelAttribute(): string
    {
        return $this->label ?: ucfirst($this->platform);
    }

    public function getPlatformIconAttribute(): string
    {
        $icons = [
            'twitter' => 'fab fa-twitter',
            'linkedin' => 'fab fa-linkedin',
            'instagram' => 'fab fa-instagram',
            'facebook' => 'fab fa-facebook',
            'youtube' => 'fab fa-youtube',
            'tiktok' => 'fab fa-tiktok',
            'github' => 'fab fa-github',
            'website' => 'fas fa-globe',
            'custom' => 'fas fa-link',
        ];

        return $icons[$this->platform] ?? 'fas fa-link';
    }
}
