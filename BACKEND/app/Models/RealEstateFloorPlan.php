<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RealEstateFloorPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'real_estate_ad_id',
        'type',
        'area_sqft',
        'area_sqm',
        'price',
        'image_path',
        'possession_date',
        'tag'
    ];

    public function property()
    {
        return $this->belongsTo(RealEstateAd::class, 'real_estate_ad_id');
    }
}
