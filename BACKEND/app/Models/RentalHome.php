<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RentalHome extends Model
{
    use HasFactory;

    protected $table = 'RentalHomes';

    protected $fillable = [
        'property_type', 'available_from', 'area', 'deposit_rent', 'bhk', 'address',
        'community_name', 'amenities', 'pets', 'images', 'accommodates', 'smoking', 'owner_id', 'location_state', 'location_city', 'location_zipcode', 'owner_name', 'description'
    ];

    protected $casts = [
        'available_from' => 'date',
        'area' => 'decimal:2',
        'deposit_rent' => 'decimal:2',
        'pets' => 'boolean',
        'accommodates' => 'integer',
        'images' => 'array',
    ];

    // Convert language array to a comma-separated string for SET type compatibility
    public function setAmenitiesAttribute($value)
    {
        // $this->attributes['amenities'] = is_array($value) ? implode(',', $value) : $value;
        // List of allowed values as per DB SET column
        $allowed = ['Gym', 'Swimming Pool', 'Club House'];

        if (is_array($value)) {
            // Keep only allowed values with exact match
            $value = array_intersect($value, $allowed);
            $this->attributes['amenities'] = implode(',', $value);
        } else {
            $this->attributes['amenities'] = $value;
        }
    }

    // Convert comma-separated string back to array for Laravel use
    public function getAmenitiesAttribute($value)
    {
        return explode(',', $value);
    }

    // Handle images - decode JSON or return as array
    public function getImagesAttribute($value)
    {
        if (empty($value)) {
            return [];
        }
        
        // If it's already an array (from cast), return it
        if (is_array($value)) {
            return $value;
        }
        
        // Try to decode JSON
        $decoded = json_decode($value, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded;
        }
        
        // If it's a comma-separated string, split it
        if (is_string($value) && strpos($value, ',') !== false) {
            return array_map('trim', explode(',', $value));
        }
        
        // Otherwise return as single-item array
        return [$value];
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
