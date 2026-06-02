<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CommunityRide;
use App\Models\User;
use Illuminate\Support\Str;
use Carbon\Carbon;

class CommunityRidesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = User::inRandomOrder()->take(50)->get();
        
        if ($users->isEmpty()) {
            $this->command->info('No users found. Please seed users first.');
            return;
        }

        // Regions: Chicago, NJ, CA, TX
        $regions = [
            'Chicago' => [
                'cities' => ['Chicago', 'Naperville', 'Schaumburg', 'Evanston', 'Oak Brook'],
                'state' => 'IL'
            ],
            'NJ' => [
                'cities' => ['Edison', 'Jersey City', 'Newark', 'Hoboken', 'Princeton', 'Cherry Hill'],
                'state' => 'NJ'
            ],
            'CA' => [
                'cities' => ['San Francisco', 'San Jose', 'Los Angeles', 'Fremont', 'Sunnyvale', 'Santa Clara'],
                'state' => 'CA'
            ],
            'TX' => [
                'cities' => ['Austin', 'Dallas', 'Houston', 'Frisco', 'Plano', 'Irving'],
                'state' => 'TX'
            ],
            'NY' => [
                'cities' => ['New York', 'Brooklyn', 'Queens', 'Staten Island'],
                'state' => 'NY'
            ]
        ];

        $rideTypes = ['commute', 'event', 'intercity'];
        $postTypes = ['offering', 'seeking'];
        $fuelSharingOpts = ['yes', 'no', 'flexible'];

        $eventNames = ['Navratri Garba 2026', 'Diwali Mela', 'Holi Festival', 'Desi Tech Meetup', 'Bollywood Concert', 'Local Temple Visit'];
        $landmarks = ['Downtown', 'Tech Park', 'Train Station', 'University Campus', 'Mall', 'Grocery Store', 'Apartment Complex'];

        for ($i = 0; $i < 100; $i++) {
            $user = $users->random();
            $regionKey = array_rand($regions);
            $region = $regions[$regionKey];
            
            // For intercity, maybe pick a different region sometimes
            $toRegion = $region;
            if (rand(1, 10) > 7) {
                $toRegionKey = array_rand($regions);
                $toRegion = $regions[$toRegionKey];
            }

            $fromCity = $region['cities'][array_rand($region['cities'])];
            $toCity = $toRegion['cities'][array_rand($toRegion['cities'])];
            
            // Ensure they aren't the exact same city if it's the same region
            if ($fromCity === $toCity && count($region['cities']) > 1) {
                $otherCities = array_diff($region['cities'], [$fromCity]);
                $toCity = $otherCities[array_rand($otherCities)];
            }

            $rideType = $rideTypes[array_rand($rideTypes)];
            $postType = $postTypes[array_rand($postTypes)];
            $fuelSharing = $fuelSharingOpts[array_rand($fuelSharingOpts)];
            
            $fromLoc = $landmarks[array_rand($landmarks)];
            $toLoc = $landmarks[array_rand($landmarks)];

            $title = "{$postType} ride from {$fromCity} to {$toCity}";
            
            $days = ['mon', 'tue', 'wed', 'thu', 'fri'];
            // Random subset of days
            $randomDays = array_intersect_key($days, array_flip(array_rand($days, rand(2, 5))));

            $data = [
                'poster_user_id' => $user->id,
                'ride_type' => $rideType,
                'post_type' => $postType,
                'title' => ucfirst($title),
                'slug' => Str::slug($title . ' ' . Str::random(6)),
                'slug_id' => Str::random(6),
                'from_location_text' => $fromLoc,
                'from_city' => $fromCity,
                'from_state' => $region['state'],
                'to_location_text' => $toLoc,
                'to_city' => $toCity,
                'to_state' => $toRegion['state'],
                'seats' => rand(1, 4),
                'fuel_sharing' => $fuelSharing,
                'contact_preference' => 'desipath_only',
                'notes' => 'Looking forward to a great ride. Please reach out if interested!',
                'status' => 'active',
                'departure_time' => sprintf("%02d:%02d", rand(6, 10), array_rand([0=>0, 15=>15, 30=>30, 45=>45])),
            ];

            if ($rideType === 'commute') {
                $data['schedule_days_json'] = array_values($randomDays); // Cast will json_encode this
            } elseif ($rideType === 'event') {
                $data['event_name'] = $eventNames[array_rand($eventNames)];
                $data['trip_date'] = Carbon::now()->addDays(rand(2, 30))->format('Y-m-d');
            } elseif ($rideType === 'intercity') {
                $data['trip_date'] = Carbon::now()->addDays(rand(2, 30))->format('Y-m-d');
            }

            CommunityRide::create($data);
        }

        $this->command->info('100 community rides created successfully!');
    }
}
