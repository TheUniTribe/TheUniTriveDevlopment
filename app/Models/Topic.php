<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Topic Model
 *
 * Represents a topic within an interest category.
 * Topics can belong to multiple communities through a many-to-many relationship.
 *
 * @property int $id
 * @property int $interest_id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string|null $icon
 * @property int $members_count
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 *
 * @property-read \App\Models\Interest $interest
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Community[] $communities
 */
class Topic extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'interest_id',
        'name',
        'slug',
        'description',
        'icon',
        'members_count',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'members_count' => 'integer',
        'interest_id' => 'integer',
    ];

    /**
     * Get the interest that owns this topic
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function interest()
    {
        return $this->belongsTo(Interest::class);
    }

    /**
     * Get all communities for this topic (many-to-many)
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function communities()
    {
        return $this->belongsToMany(Community::class, 'community_topic')
            ->withTimestamps();
    }

    /**
     * Add a new topic record
     *
     * @param array $data
     * @return int
     */
    public function add(array $data): int
    {
        return $this->insertGetId($data);
    }

    /**
     * Modify an existing topic record
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
     * Remove a topic record
     *
     * @param int $id
     * @return int
     */
    public function remove(int $id): int
    {
        return $this->where('id', $id)->delete();
    }
}
