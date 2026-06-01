<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VolunteerPost extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];

    protected $casts = [
        'comfortable_helping' => 'array',
        'special_needs' => 'array',
        'route_legs' => 'array',
        'languages' => 'array',
        'travel_date_confirmed' => 'boolean',
        'language_flexible' => 'boolean',
        'travel_date' => 'date',
        'travel_month_from' => 'date',
        'travel_month_to' => 'date',
        'expires_at' => 'datetime',
        'prior_experience' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
