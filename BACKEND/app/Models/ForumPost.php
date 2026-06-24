<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Str;

class ForumPost extends Model
{
    protected $fillable = ['user_id', 'title', 'slug', 'content', 'category', 'votes', 'location', 'location_tag', 'image_url'];

    protected static function booted()
    {
        static::creating(function ($post) {
            $post->slug = Str::slug($post->title) . '-' . Str::random(5);
            if ($post->location && !$post->location_tag) {
                $post->location_tag = self::getTagFromLocation($post->location);
            }
        });
    }

    public static function getTagFromLocation($location)
    {
        if (!$location) return null;

        $stateToTag = [
            'Alabama' => '#DesiATLSouth',
            'Alaska' => '#DesiPacificNW',
            'Arizona' => '#DesiAZ',
            'Arkansas' => '#DesiNWA',
            'California' => '#DesiCA',
            'Colorado' => '#DesiDenverUtahWyoming',
            'Connecticut' => '#DesiMACTNewEngland',
            'Delaware' => '#DesiPhillyDEWV',
            'District of Columbia' => '#DesiDMVArea',
            'Florida' => '#DesiFL',
            'Georgia' => '#DesiATLSouth',
            'Hawaii' => '#DesiCA',
            'Idaho' => '#DesiPacificNW',
            'Illinois' => '#DesiChicagoIL',
            'Indiana' => '#DesiIndy',
            'Iowa' => '#DesiWisconsinIO',
            'Kansas' => '#DesiMOKS',
            'Kentucky' => '#DesiLouisville',
            'Louisiana' => '#DesiLouisiana',
            'Maine' => '#DesiMACTNewEngland',
            'Maryland' => '#DesiDMVArea',
            'Massachusetts' => '#DesiMACTNewEngland',
            'Michigan' => '#DesiMichigan',
            'Minnesota' => '#DesiMinnesotaNDSD',
            'Mississippi' => '#DesiATLSouth',
            'Missouri' => '#DesiMOKS',
            'Montana' => '#DesiPacificNW',
            'Nebraska' => '#DesiOmaha',
            'Nevada' => '#DesiLasVegas',
            'New Hampshire' => '#DesiMACTNewEngland',
            'New Jersey' => '#DesiNYNJ',
            'New York' => '#DesiNYNJ',
            'North Carolina' => '#DesiCarolinas',
            'North Dakota' => '#DesiMinnesotaNDSD',
            'Ohio' => '#DesiOhio',
            'Oklahoma' => '#DesiOKNM',
            'Oregon' => '#DesiPacificNW',
            'Pennsylvania' => '#DesiPhillyDEWV',
            'Rhode Island' => '#DesiMACTNewEngland',
            'South Carolina' => '#DesiCarolinas',
            'South Dakota' => '#DesiMinnesotaNDSD',
            'Tennessee' => '#DesiNashville',
            'Texas' => '#DesiTX',
            'Utah' => '#DesiDenverUtahWyoming',
            'Vermont' => '#DesiMACTNewEngland',
            'Virginia' => '#DesiDMVArea',
            'Washington' => '#DesiPacificNW',
            'West Virginia' => '#DesiPhillyDEWV',
            'Wisconsin' => '#DesiWisconsinIO',
            'Wyoming' => '#DesiDenverUtahWyoming',
            'Ontario' => '#DesiGTA',
            'British Columbia' => '#DesiVancouver',
        ];

        foreach ($stateToTag as $state => $tag) {
            if (stripos($location, $state) !== false) {
                return $tag;
            }
        }

        return null;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(ForumComment::class, 'post_id');
    }
}
