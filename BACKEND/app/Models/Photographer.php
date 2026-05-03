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
        'status'
    ];

    protected $casts = [
        'services' => 'array'
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
