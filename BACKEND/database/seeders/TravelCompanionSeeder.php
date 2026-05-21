<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TravelRequest;
use App\Models\VolunteerPost;
use App\Models\User;
use Faker\Factory as Faker;
use Carbon\Carbon;

class TravelCompanionSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();
        
        // Ensure there's at least one user
        $user = User::first();
        if (!$user) {
            $user = clone $user; // Fallback or just skip
        }

        $directions = ['india_to_usa_canada', 'usa_canada_to_india'];
        $indianAirports = ['DEL', 'BOM', 'BLR', 'HYD', 'MAA', 'CCU', 'COK'];
        $usAirports = ['JFK', 'EWR', 'SFO', 'ORD', 'SEA', 'IAD', 'DFW', 'LAX', 'ATL', 'YYZ', 'YVR'];
        $languages = ['English', 'Hindi', 'Telugu', 'Tamil', 'Punjabi', 'Gujarati', 'Marathi', 'Bengali', 'Malayalam'];
        
        // 50 Requests
        for ($i = 0; $i < 50; $i++) {
            $dir = $faker->randomElement($directions);
            if ($dir === 'india_to_usa_canada') {
                $dep = $faker->randomElement($indianAirports);
                $arr = $faker->randomElement($usAirports);
            } else {
                $dep = $faker->randomElement($usAirports);
                $arr = $faker->randomElement($indianAirports);
            }

            $routeLegs = [
                ['iata_code' => $dep, 'leg_type' => 'departure'],
                ['iata_code' => $arr, 'leg_type' => 'destination']
            ];

            TravelRequest::create([
                'user_id' => $user ? User::inRandomOrder()->first()->id : 1,
                'traveler_relation' => $faker->randomElement(['parents', 'spouse', 'friend', 'other']),
                'traveler_age' => $faker->numberBetween(18, 80),
                'special_needs' => $faker->boolean(20) ? 'Wheelchair assistance needed.' : null,
                'comfortable_helping' => $faker->boolean(80),
                'travel_direction' => $dir,
                'route_legs' => $routeLegs,
                'travel_date_confirmed' => true,
                'travel_date' => Carbon::now()->addDays($faker->numberBetween(5, 90)),
                'languages' => $faker->randomElements($languages, $faker->numberBetween(1, 3)),
                'language_flexible' => $faker->boolean(70),
                'gift_card_offer' => (string) $faker->randomElement([0, 50, 100]),
                'comments' => $faker->sentence(10),
                'status' => 'active',
                'expires_at' => Carbon::now()->addMonths(3),
            ]);
        }

        // 50 Volunteers
        for ($i = 0; $i < 50; $i++) {
            $dir = $faker->randomElement($directions);
            if ($dir === 'india_to_usa_canada') {
                $dep = $faker->randomElement($indianAirports);
                $arr = $faker->randomElement($usAirports);
            } else {
                $dep = $faker->randomElement($usAirports);
                $arr = $faker->randomElement($indianAirports);
            }

            $routeLegs = [
                ['iata_code' => $dep, 'leg_type' => 'departure'],
                ['iata_code' => $arr, 'leg_type' => 'destination']
            ];

            VolunteerPost::create([
                'user_id' => $user ? User::inRandomOrder()->first()->id : 1,
                'travelling_as' => $faker->randomElement(['individual', 'couple', 'family']),
                'prior_experience' => $faker->boolean(40),
                'comfortable_helping' => true,
                'special_needs' => $faker->boolean(10) ? 'Travelling with infant' : null,
                'travel_direction' => $dir,
                'route_legs' => $routeLegs,
                'travel_date_confirmed' => true,
                'travel_date' => Carbon::now()->addDays($faker->numberBetween(5, 90)),
                'languages' => $faker->randomElements($languages, $faker->numberBetween(1, 3)),
                'language_flexible' => $faker->boolean(80),
                'gift_card_preference' => (string) $faker->randomElement(['free', '50', '100']),
                'comments' => 'Happy to help elderly travelers navigate connections. ' . $faker->sentence(8),
                'status' => 'active',
                'expires_at' => Carbon::now()->addMonths(3),
            ]);
        }
    }
}
