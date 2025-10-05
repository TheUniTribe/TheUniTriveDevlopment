<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Network extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'type',
    ];

    /**
     * The users that belong to the network.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}
