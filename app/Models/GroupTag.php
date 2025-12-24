<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GroupTag extends Model
{
    use HasFactory;

    protected $table = 'group_tag';

    protected $fillable = [
        'group_id',
        'tag_id',
    ];

    protected $casts = [
        'group_id' => 'integer',
        'tag_id' => 'integer',
    ];

    /**
     * Get the group that owns the group_tag.
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * Get the tag that owns the group_tag.
     */
    public function tag(): BelongsTo
    {
        return $this->belongsTo(Tag::class);
    }
}
