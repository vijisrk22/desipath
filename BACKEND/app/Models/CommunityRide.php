<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CommunityRide extends Model
{
    use HasFactory;

    protected $table = 'community_rides';
    protected $primaryKey = 'ride_id';
    
    protected $guarded = [];

    protected $casts = [
        'trip_date' => 'date',
        'return_date' => 'date',
        'schedule_recurring_until' => 'date',
        'return_ride_available' => 'boolean',
        'featured' => 'boolean',
        'expires_at' => 'datetime',
        'last_active_at' => 'datetime',
        'schedule_days_json' => 'array',
        'stops_json' => 'array',
    ];

    public function poster()
    {
        return $this->belongsTo(User::class, 'poster_user_id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
