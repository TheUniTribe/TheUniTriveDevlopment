<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use App\Notifications\CustomVerifyEmail;


class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'profile_picture',
        'first_name',
        'last_name',
        'title',
        'bio',
        'about',
        'website_url',
        'phone',
        'date_of_birth',
        'gender',
        'location',
        'account_type',
        'account_status',
        'is_verified',
        'two_factor_enabled',
        'two_factor_secret',
        'password_reset_token',
        'password_reset_expires',
        'last_activity_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'password_reset_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'password_reset_expires' => 'datetime',
            'last_activity_at' => 'datetime',
            'date_of_birth' => 'date',
            'password' => 'hashed',
            'is_verified' => 'boolean',
            'two_factor_enabled' => 'boolean',
        ];
    }

    /**
     * Get the user's full name.
     */
    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    /**
     * Get the user's display name (username if no name, otherwise full name).
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->full_name ?: $this->username;
    }

    /**
     * Get the user's initial for avatar.
     */
    public function getInitialAttribute(): string
    {
        if ($this->first_name) {
            return strtoupper(substr($this->first_name, 0, 1));
        }
        return strtoupper(substr($this->username, 0, 1));
    }

    /**
     * Check if user has premium account.
     */
    public function isPremium(): bool
    {
        return $this->account_type === 'premium';
    }

    /**
     * Check if user account is active.
     */
    public function isActive(): bool
    {
        return $this->account_status === 'active';
    }

    /**
     * Check if user email is verified.
     */
    public function hasVerifiedEmail(): bool
    {
        return !is_null($this->email_verified_at);
    }

    /**
     * Check if user phone is verified.
     */
    public function hasVerifiedPhone(): bool
    {
        return !is_null($this->phone_verified_at);
    }

    /**
     * Mark the given user's email as verified.
     */
    public function markEmailAsVerified(): bool
    {
        return $this->forceFill([
            'email_verified_at' => $this->freshTimestamp(),
            'is_verified' => true,
        ])->save();
    }

    /**
     * Mark the given user's phone as verified.
     */
    public function markPhoneAsVerified(): bool
    {
        return $this->forceFill([
            'phone_verified_at' => $this->freshTimestamp(),
        ])->save();
    }

    /**
     * Send the email verification notification.
     */
    public function sendEmailVerificationNotification(): void
    {
        $this->notify(new CustomVerifyEmail);
    }

    /**
     * Get the educations for the user.
     */
    public function educations(): HasMany
    {
        return $this->hasMany(UserEducation::class);
    }

    /**
     * Get the experiences for the user.
     */
    public function experiences(): HasMany
    {
        return $this->hasMany(UserExperience::class);
    }

    /**
     * Get the links for the user.
     */
    public function links(): HasMany
    {
        return $this->hasMany(UserLink::class);
    }

    /**
     * Get public links for the user.
     */
    public function publicLinks(): HasMany
    {
        return $this->links()->where('is_public', true);
    }

    /**
     * Get current education (if any).
     */
    public function getCurrentEducationAttribute()
    {
        return $this->educations()
            ->whereNull('end_year')
            ->orderBy('start_year', 'desc')
            ->first();
    }

    /**
     * Get current experience (if any).
     */
    public function getCurrentExperienceAttribute()
    {
        return $this->experiences()
            ->whereNull('end_date')
            ->orderBy('start_date', 'desc')
            ->first();
    }

    /**
     * Scope a query to only include active users.
     */
    public function scopeActive($query)
    {
        return $query->where('account_status', 'active');
    }

    /**
     * Scope a query to only include premium users.
     */
    public function scopePremium($query)
    {
        return $query->where('account_type', 'premium');
    }

    /**
     * Scope a query to only include verified users.
     */
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true)
                    ->whereNotNull('email_verified_at');
    }

    /**
     * Update user's last activity timestamp.
     */
    public function updateLastActivity(): bool
    {
        return $this->forceFill([
            'last_activity_at' => $this->freshTimestamp(),
        ])->save();
    }

    /**
     * Get user's social links as array from links table.
     */
    public function getSocialLinksAttribute(): array
    {
        return $this->links->mapWithKeys(function ($link) {
            return [$link->platform => [
                'url' => $link->url,
                'label' => $link->display_label,
                'icon' => $link->platform_icon,
                'is_public' => $link->is_public,
            ]];
        })->toArray();
    }

    /**
     * Get user's profile completeness percentage.
     */
    public function getProfileCompletenessAttribute(): int
    {
        $fields = [
            'profile_picture' => !empty($this->profile_picture),
            'first_name' => !empty($this->first_name),
            'last_name' => !empty($this->last_name),
            'title' => !empty($this->title),
            'bio' => !empty($this->bio),
            'about' => !empty($this->about),
            'phone' => !empty($this->phone),
        ];

        $filledFields = array_sum($fields);
        $totalFields = count($fields);
        return (int) (($filledFields / $totalFields) * 100);
    }
}
