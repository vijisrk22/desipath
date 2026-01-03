<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassesforKidsAd extends Model
{
    use HasFactory;

    protected $table = 'ClassesforKidsAds';

    protected $fillable = [
        'user_id',
        'class_type',
        'address',
        'state',
        'city',
        'description',
        'image',
        'start_date',
        'price',
        'language_specific',
        'language',
        'contact_form',
    ];

    protected $casts = [
        'language' => 'array', // Ensures that 'language' is treated as an array
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

    // Define the relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
