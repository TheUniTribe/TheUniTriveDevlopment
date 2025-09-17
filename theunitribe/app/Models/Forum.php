<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;
use App\Models\Network;

class Forum extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'category', 'comments', 'user_id', 'network_id'];

    /**
     * Get the user that owns the forum.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the network that the forum belongs to.
     */
    public function network(): BelongsTo
    {
        return $this->belongsTo(Network::class);
    }
}
