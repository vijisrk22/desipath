<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SecureMatchProfile extends Model
{
    protected $table = 'sm_profiles';

    protected $fillable = [
        'user_id', 'display_name', 'dob', 'gender', 'community', 'religion',
        'education', 'profession', 'company_name', 'languages_spoken', 'city', 'country', 'residency_tier',
        'trust_score', 'about_me', 'voice_note_url', 'family_details',
        'contact_phone', 'contact_email', 'status', 'food_preference', 'linkedin_url', 'created_by_relative'
    ];

    protected $casts = [
        'dob' => 'date',
        'languages_spoken' => 'array',
    ];

    protected $appends = ['age'];

    public function getAgeAttribute()
    {
        return $this->dob ? $this->dob->age : null;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function photos()
    {
        return $this->hasMany(SecureMatchPhoto::class, 'profile_id');
    }
}
