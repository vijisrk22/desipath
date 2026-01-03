<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TravelCompanionsSeeder extends Seeder
{
    public function run()
    {
        DB::table('TravelCompanions')->insert([
            [
                'travellers' => 'John Doe',
                'language_spoken' => 'Tamil,Hindi',
                'language_travellers' => 'Tamil',
                'travel_date' => '2024-12-15',
                'flexible_language' => true,
                'tentative' => false,
                'travel_finalized' => true,
                'finalized_date' => '2024-12-01',
                'from_location' => 'Chennai',
                'to_location' => 'Bangalore',
                'service_preference' => 'Amazon gift card',
                'amazon_gift_card_value' => '100$',
                'willing_gift' => true,
                'gift_card_value' => '100$',
                'poster_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'travellers' => 'Jane Smith',
                'language_spoken' => 'Telugu',
                'language_travellers' => 'Telugu,Hindi',
                'travel_date' => '2024-11-30',
                'flexible_language' => false,
                'tentative' => true,
                'travel_finalized' => false,
                'finalized_date' => null,
                'from_location' => 'Hyderabad',
                'to_location' => 'Mumbai',
                'service_preference' => 'Volunteer (Free service)',
                'amazon_gift_card_value' => null,
                'willing_gift' => false,
                'gift_card_value' => null,
                'poster_id' => 2,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            // Add more entries as needed
        ]);
    }
}

