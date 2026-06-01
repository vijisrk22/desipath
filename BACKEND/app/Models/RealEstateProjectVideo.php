<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RealEstateProjectVideo extends Model
{
    use HasFactory;

    protected $fillable = [
        'real_estate_ad_id',
        'video_url',
        'title'
    ];

    public function property()
    {
        return $this->belongsTo(RealEstateAd::class, 'real_estate_ad_id');
    }
}
