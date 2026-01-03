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
        'variant',
        'pictures',
        'location',
        'seller_id',
        'seller_name',
        'price',
        'description'
    ];

    // Cast properties to specific types
    protected $casts = [
        'make' => 'string',
        'model' => 'string',
        'year' => 'integer',
        'miles' => 'integer',
        'variant' => 'string',
        'pictures' => 'array', // assuming you're saving them as a JSON array in DB
        'location' => 'string',
        'seller_id' => 'integer',
        'price' => 'decimal:2',
        'description' => 'string'
    ];
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
