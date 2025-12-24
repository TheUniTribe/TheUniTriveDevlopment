<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * CommunityTag Model
 *
 * Pivot model for community ↔ tag relationship
 *
 * @property int $id
 * @property int $community_id
 * @property int $tag_id
 */
class CommunityTag extends Model
{
    use HasFactory;

    /**
     * Table name
     */
    protected $table = 'community_tag';

    /**
     * Mass assignable fields
     */
    protected $fillable = [
        'community_id',
        'tag_id',
    ];

    /**
     * Casts
     */
    protected $casts = [
        'community_id' => 'integer',
        'tag_id' => 'integer',
    ];

    /* -------------------------------------------------
     | Relationships
     |--------------------------------------------------*/

    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    public function tag()
    {
        return $this->belongsTo(Tag::class);
    }

    /* -------------------------------------------------
     | DB-ONLY Operations (NO logic)
     |--------------------------------------------------*/

    /**
     * Add a new community-tag record
     */
    public function add(array $data): int
    {
        return $this->insertGetId($data);
    }

    /**
     * Modify an existing community-tag record
     */
    public function modify(int $id, array $data): int
    {
        return $this->where('id', $id)->update($data);
    }

    /**
     * Remove a community-tag record by ID
     */
    public function remove(int $id): int
    {
        return $this->where('id', $id)->delete();
    }

    /**
     * Remove by community + tag (common pivot case)
     */
    public function removeByCommunityAndTag(int $communityId, int $tagId): int
    {
        return $this->where('community_id', $communityId)
            ->where('tag_id', $tagId)
            ->delete();
    }
}
