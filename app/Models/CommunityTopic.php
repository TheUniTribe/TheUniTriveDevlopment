<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * CommunityTopic Pivot Model
 *
 * Represents the many-to-many relationship between communities and topics.
 * This pivot table allows a community to belong to multiple topics and
 * a topic to have multiple communities.
 *
 * @property int $id
 * @property int $community_id
 * @property int $topic_id
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 *
 * @property-read \App\Models\Community $community
 * @property-read \App\Models\Topic $topic
 */
class CommunityTopic extends Pivot
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'community_topic';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'community_id',
        'topic_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'community_id' => 'integer',
        'topic_id' => 'integer',
    ];

    /**
     * Get the community that this pivot belongs to
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    /**
     * Get the topic that this pivot belongs to
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }

    /**
     * Add a new community-topic relationship
     *
     * @param array $data
     * @return int
     */
    public function add(array $data): int
    {
        return $this->insertGetId($data);
    }

    /**
     * Modify an existing community-topic relationship
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
     * Remove a community-topic relationship
     *
     * @param int $id
     * @return int
     */
    public function remove(int $id): int
    {
        return $this->where('id', $id)->delete();
    }
}
