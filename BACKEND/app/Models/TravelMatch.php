<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TravelMatch extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];

    protected $casts = [
        'matched_at' => 'datetime',
        'travel_date' => 'date',
        'review_requested_at' => 'datetime',
    ];

    public function seeker()
    {
        return $this->belongsTo(User::class, 'seeker_user_id');
    }

    public function volunteer()
    {
        return $this->belongsTo(User::class, 'volunteer_user_id');
    }

    public function requestPost()
    {
        return $this->belongsTo(TravelRequest::class, 'request_post_id');
    }

    public function volunteerPost()
    {
        return $this->belongsTo(VolunteerPost::class, 'volunteer_post_id');
    }
}
