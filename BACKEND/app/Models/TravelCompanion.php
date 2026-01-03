<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="TravelCompanion",
 *     @OA\Property(property="travellers", type="string", example="John Doe, Jane Doe"),
 *     @OA\Property(property="language_spoken", type="array", @OA\Items(type="string"), example={"Tamil", "Telugu"}),
 *     @OA\Property(property="language_travellers", type="array", @OA\Items(type="string"), example={"Tamil", "Telugu"}),
 *     @OA\Property(property="travel_date", type="string", format="date", example="2024-01-01"),
 *     @OA\Property(property="flexible_language", type="boolean", example=true),
 *     @OA\Property(property="tentative", type="boolean", example=true),
 *     @OA\Property(property="travel_finalized", type="boolean", example=true),
 *     @OA\Property(property="finalized_date", type="string", format="date", example="2024-02-01"),
 *     @OA\Property(property="from_location", type="string", example="Chennai"),
 *     @OA\Property(property="to_location", type="string", example="Bangalore"),
 *     @OA\Property(property="service_preference", type="string", example="Amazon gift card"),
 *     @OA\Property(property="amazon_gift_card_value", type="string", example="50$"),
 *     @OA\Property(property="willing_gift", type="boolean", example=true),
 *     @OA\Property(property="gift_card_value", type="string", example="50$"),
 *     @OA\Property(property="poster_id", type="integer", example=1)
 * )
 */
class TravelCompanion extends Model
{
    use HasFactory;

    protected $table = 'TravelCompanions';

    protected $fillable = [
        'travellers',
        'travellers_who',
        'language_spoken',
        'language_travellers',
        'travel_date',
        'flexible_language',
        'tentative',
        'travel_finalized',
        'finalized_date',
        'from_location',
        'to_location',
        'service_preference',
        'amazon_gift_card_value',
        'willing_gift',
        'gift_card_value',
        'poster_id'
    ];

    protected $casts = [
        'language_spoken' => 'array',
        'language_travellers' => 'array',
        'travel_date' => 'date',
        'finalized_date' => 'date',
        'flexible_language' => 'boolean',
        'tentative' => 'boolean',
        'travel_finalized' => 'boolean',
        'willing_gift' => 'boolean'
    ];

     // Convert language array to a comma-separated string for SET type compatibility
     public function setLanguageSpokenAttribute($value)
     {
         $this->attributes['language_spoken'] = is_array($value) ? implode(',', $value) : $value;
     }
 
     // Convert comma-separated string back to array for Laravel use
     public function getLanguageSpokenAttribute($value)
     {
         return explode(',', $value);
     }

     // Convert language array to a comma-separated string for SET type compatibility
     public function setLanguageTravellersAttribute($value)
     {
         $this->attributes['language_travellers'] = is_array($value) ? implode(',', $value) : $value;
     }
 
     // Convert comma-separated string back to array for Laravel use
     public function getLanguageTravellersAttribute($value)
     {
         return explode(',', $value);
     }
}
