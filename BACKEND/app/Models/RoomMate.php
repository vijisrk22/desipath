<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomMate extends Model
{
    use HasFactory;

    // Table name, if it differs from the plural form of the model
    protected $table = 'RoomMates';

    // Fillable properties
    protected $fillable = [
        'owner',
        'agent',
        'location_state',
        'location_city',
        'location_zipcode',
        'sharing_type',
        'kitchen_available',
        'shared_bathroom',
        'rent',
        'rent_frequency',
        'utilities_included',
        'photos',
        'description',
        'available_from',
        'available_to',
        'gender_preference',
        'car_parking_available',
        'food_preference',
        'washer_dryer',
        'poster_id',
        'poster_name'
    ];

    // Cast properties to specific types
    protected $casts = [
        'owner' => 'boolean',
        'agent' => 'boolean',
        'kitchen_available' => 'boolean',
        'shared_bathroom' => 'boolean',
        'utilities_included' => 'boolean',
        'car_parking_available' => 'boolean',
        'washer_dryer' => 'boolean',
        'rent' => 'decimal:2',
        'photos' => 'array',
        'available_from' => 'date',
        'available_to' => 'date',
    ];

    // Relationships
    public function poster()
    {
        return $this->belongsTo(User::class, 'poster_id');
    }
}
