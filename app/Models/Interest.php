<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Interest Model
 *
 * Represents an interest category that users can follow.
 * Each interest can have multiple topics.
 *
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string|null $icon
 * @property string|null $color_class
 * @property string|null $cover_image
 * @property bool $is_trending
 * @property int $members_count
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 *
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Topic[] $topics
 */
class Interest extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'color_class',
        'cover_image',
        'is_trending',
        'members_count',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_trending' => 'boolean',
        'is_active' => 'boolean',
        'members_count' => 'integer',
    ];

    /**
     * Get all topics under this interest
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function topics()
    {
        return $this->hasMany(Topic::class);
    }

    /**
     * Add a new interest record
     *
     * @param array $data
     * @return int
     */
    public function add(array $data): int
    {
        return $this->insertGetId($data);
    }

    /**
     * Modify an existing interest record
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
     * Remove an interest record
     *
     * @param int $id
     * @return int
     */
    public function remove(int $id): int
    {
        return $this->where('id', $id)->delete();
    }
}
