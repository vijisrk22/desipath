<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DoctorAward extends Model
{
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'award_name',
        'award_type',
        'awarding_org',
        'description',
        'years_json',
        'badge_logo_url',
        'is_system_generated',
    ];

    protected $casts = [
        'years_json' => 'array',
        'is_system_generated' => 'boolean',
    ];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id', 'doctor_id');
    }
}
