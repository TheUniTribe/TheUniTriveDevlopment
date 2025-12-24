<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'icon',
        'description',
        'is_active',
        'usage_count',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'usage_count' => 'integer',
    ];

    /**
     * Get the topic that owns the tag
     */
    public function topic()
    {
        return $this->belongsTo(Topic::class);
    }

    /**
     * Get all communities that have this tag
     * (Many-to-Many relationship)
     */
    public function communities()
    {
        return $this->belongsToMany(
            Community::class,
            'community_tag',  // pivot table name
            'tag_id',         // foreign key on pivot table
            'community_id'    // related key on pivot table
        );
    }
}
