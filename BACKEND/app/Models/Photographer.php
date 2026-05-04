<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Photographer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'bio',
        'service_type',
        'experience_years',
        'languages',
        'services',
        'profile_photo',
        'backdrop_photo',
        'video_url',
        'video_url_2',
        'video_url_3',
        'open_to_travel',
        'travel_policy',
        'album_url',
        'status'
    ];

    protected $casts = [
        'services' => 'array',
        'open_to_travel' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function packages()
    {
        return $this->hasMany(PhotographerPackage::class);
    }

    public function locations()
    {
        return $this->hasMany(PhotographerLocation::class);
    }
}
