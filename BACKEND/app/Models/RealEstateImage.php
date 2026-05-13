<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RealEstateImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'real_estate_ad_id',
        'image_path'
    ];

    public function property()
    {
        return $this->belongsTo(RealEstateAd::class, 'real_estate_ad_id');
    }
}
