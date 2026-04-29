<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuySellCar extends Model
{
    use HasFactory;

    // Table name (optional if table name follows Laravel's convention)
    protected $table = 'BuySellCars';

    // Specify which attributes are mass assignable
    protected $fillable = [
        'make',
        'model',
        'year',
        'miles',
        'pictures',
        'location',
        'seller_id',
        'seller_name',
        'price',
        'description',
        'fuel_type_id',
        'transmission_id',
        'condition_id',
        'is_dealer',
        'dealer_name',
        'dealer_zipcode',
        'dealer_contact_person',
        'dealer_contact_number',
        'dealer_email',
        'owner_name',
        'owner_contact_number',
        'drive_type',
        'mpg',
        'vin',
        'features',
        'location_city',
        'location_state',
        'location_zipcode',
        'latitude',
        'longitude',
        'status',
    ];

    protected $casts = [
        'make' => 'string',
        'model' => 'string',
        'year' => 'integer',
        'miles' => 'integer',
        'pictures' => 'array',
        'location' => 'string',
        'seller_id' => 'integer',
        'fuel_type_id' => 'integer',
        'transmission_id' => 'integer',
        'condition_id' => 'integer',
        'price' => 'decimal:2',
        'description' => 'string',
        'is_dealer' => 'boolean',
        'features' => 'array',
    ];

    public function fuelType() { return $this->belongsTo(CarFuelType::class, 'fuel_type_id'); }
    public function transmission() { return $this->belongsTo(CarTransmission::class, 'transmission_id'); }
    public function condition() { return $this->belongsTo(CarCondition::class, 'condition_id'); }
    /**
     * Relationship to the User (Seller)
     */
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Accessor to get the car's age
     */
    public function getCarAgeAttribute()
    {
        return date('Y') - $this->year;
    }

    // Add any other custom methods or relationships as needed
}
