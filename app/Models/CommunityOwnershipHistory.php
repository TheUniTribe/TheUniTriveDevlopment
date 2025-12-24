<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommunityOwnershipHistory extends Model
{
    protected $table = 'community_ownership_history';

    protected $fillable = [
        'community_id',
        'previous_owner_id',
        'new_owner_id',
        'transferred_by',
        'transfer_type',
        'transfer_reason',
        'transfer_amount',
        'transferred_at',
    ];

    protected $casts = [
        'transferred_at' => 'datetime',
        'transfer_amount' => 'decimal:2',
    ];

    /**
     * Get the community that this transfer belongs to.
     */
    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    /**
     * Get the previous owner.
     */
    public function previousOwner()
    {
        return $this->belongsTo(User::class, 'previous_owner_id');
    }

    /**
     * Get the new owner.
     */
    public function newOwner()
    {
        return $this->belongsTo(User::class, 'new_owner_id');
    }

    /**
     * Get the user who performed the transfer.
     */
    public function transferredBy()
    {
        return $this->belongsTo(User::class, 'transferred_by');
    }
}
