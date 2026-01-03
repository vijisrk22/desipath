<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $table = 'events';

    protected $fillable = [
        'user_type',
        'event_name',
        'address',
        'state_city_zipcode',
        'from_date',
        'language',
        'event_type',
        'description',
        'ticket_price',
        'cover_images',
        'poster_images',
        'user_id',
        'user_name'
    ];

    protected $casts = [
        'from_date' => 'datetime',
        'cover_images' => 'array',
        'poster_images' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
