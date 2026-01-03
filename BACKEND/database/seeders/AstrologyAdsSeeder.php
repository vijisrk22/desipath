<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AstrologyAdsSeeder extends Seeder
{
    public function run()
    {
        DB::table('AstrologyAds')->insert([
            'user_id' => 1,
            'astrologer_type' => 'Vedic',
            'address' => '123 Star St.',
            'state' => 'Tamil Nadu',
            'city' => 'Chennai',
            'description' => 'Experienced astrologer offering Vedic astrology services.',
            'image' => 'astrology1.jpg',
            'price' => 500.00,
            'language_specific' => 1,
            'language' => 'Tamil',
            'contact_form' => 'Contact me for appointments.',
        ]);
    }
}
