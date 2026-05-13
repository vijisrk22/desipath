<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AstrologyAd extends Model
{
    use HasFactory;

    protected $table = 'AstrologyAds';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'slug',
        'display_name',
        'experience_years',
        'tagline',
        'astrologer_type',
        'address',
        'state',
        'city',
        'country',
        'phone',
        'email',
        'description',
        'certifications',
        'image',
        'profile_pic_url',
        'cover_img_url',
        'price',
        'language_specific',
        'language',
        'languages_json',
        'services_json',
        'consultation_modes',
        'locations_served',
        'contact_form',
        'status',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'language_specific' => 'boolean',
        'price' => 'decimal:2',
        'language' => 'array',
        'languages_json' => 'array',
        'services_json' => 'array',
        'consultation_modes' => 'array',
        'locations_served' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($ad) {
            if (empty($ad->slug) && !empty($ad->display_name)) {
                $ad->slug = \Illuminate\Support\Str::slug($ad->display_name) . '-' . uniqid();
            }
        });
    }

    // Convert language array to a comma-separated string for SET type compatibility
    public function setLanguageAttribute($value)
    {
        $this->attributes['language'] = is_array($value) ? implode(',', $value) : $value;
    }

    // Convert comma-separated string back to array for Laravel use
    public function getLanguageAttribute($value)
    {
        return !empty($value) ? explode(',', $value) : [];
    }
    
    /**
     * Get the user that owns the AstrologyAd.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function packages()
    {
        return $this->hasMany(AstrologyPackage::class, 'astrology_ad_id');
    }
}
