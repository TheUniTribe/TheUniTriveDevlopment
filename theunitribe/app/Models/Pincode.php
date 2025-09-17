<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Pincode
 *
 * @property int $id
 * @property string $pincode
 * @property int $city_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\City $city
 * @method static \Illuminate\Database\Eloquent\Builder|Pincode newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Pincode newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Pincode query()
 * @method static \Illuminate\Database\Eloquent\Builder|Pincode whereCityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pincode whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pincode whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pincode wherePincode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Pincode whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Pincode extends Model
{
    protected $fillable = [
        'pincode',
        'city_id',
    ];

    /**
     * Get the city that owns the pincode.
     */
    public function city()
    {
        return $this->belongsTo(City::class);
    }
}
