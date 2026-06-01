<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RealEstateAd extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'slug',
        'title',
        'description',
        'property_type',
        'country',
        'city',
        'state',
        'address',
        'price',
        'currency',
        'area_sqft',
        'bedrooms',
        'bathrooms',
        'agent_name',
        'agent_company',
        'agent_phone',
        'agent_email',
        'main_image',
        'video_url',
        'features',
        'status'
    ];

    protected $casts = [
        'features' => 'json',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function galleryImages()
    {
        return $this->hasMany(RealEstateImage::class);
    }

    public function floorPlans()
    {
        return $this->hasMany(RealEstateFloorPlan::class);
    }

    public function projectVideos()
    {
        return $this->hasMany(RealEstateProjectVideo::class);
    }

    public function landmarks()
    {
        return $this->hasMany(RealEstateLandmark::class);
    }
}
