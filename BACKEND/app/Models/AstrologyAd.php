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
        'astrologer_type',
        'address',
        'state',
        'city',
        'description',
        'image',
        'price',
        'language_specific',
        'language',
        'contact_form',
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
    ];

    // Convert language array to a comma-separated string for SET type compatibility
    public function setLanguageAttribute($value)
    {
        $this->attributes['language'] = is_array($value) ? implode(',', $value) : $value;
    }

    // Convert comma-separated string back to array for Laravel use
    public function getLanguageAttribute($value)
    {
        return explode(',', $value);
    }
    
    /**
     * Get the user that owns the AstrologyAd.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
