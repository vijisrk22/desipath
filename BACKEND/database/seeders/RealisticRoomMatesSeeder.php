<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RoomMate;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;

class RealisticRoomMatesSeeder extends Seeder
{
    public function run(): void
    {
        $sourcePath = 'F:\\Desipath-code\\Room1';
        $destPath = storage_path('app/public/roommates');

        if (!File::exists($destPath)) {
            File::makeDirectory($destPath, 0755, true);
        }

        if (!File::exists($sourcePath)) {
            $this->command->error("Source path $sourcePath does not exist.");
            return;
        }

        $allImages = File::files($sourcePath);
        if (empty($allImages)) {
            $this->command->error("No images found in $sourcePath.");
            return;
        }

        $imageCount = count($allImages);

        // Define Locations
        $ilLocations = [
            ['city' => 'Chicago', 'state' => 'Illinois', 'zip' => '60601', 'lat' => 41.8853, 'lng' => -87.6221],
            ['city' => 'Chicago', 'state' => 'Illinois', 'zip' => '60614', 'lat' => 41.9227, 'lng' => -87.6482],
            ['city' => 'Naperville', 'state' => 'Illinois', 'zip' => '60540', 'lat' => 41.7606, 'lng' => -88.1535],
            ['city' => 'Schaumburg', 'state' => 'Illinois', 'zip' => '60173', 'lat' => 42.0463, 'lng' => -88.0504],
        ];

        $njNyLocations = [
            ['city' => 'Jersey City', 'state' => 'New Jersey', 'zip' => '07302', 'lat' => 40.7178, 'lng' => -74.0431],
            ['city' => 'Edison', 'state' => 'New Jersey', 'zip' => '08817', 'lat' => 40.5042, 'lng' => -74.3980],
            ['city' => 'Hoboken', 'state' => 'New Jersey', 'zip' => '07030', 'lat' => 40.7440, 'lng' => -74.0324],
            ['city' => 'New York', 'state' => 'New York', 'zip' => '10001', 'lat' => 40.7501, 'lng' => -73.9996],
            ['city' => 'Brooklyn', 'state' => 'New York', 'zip' => '11201', 'lat' => 40.6930, 'lng' => -73.9877],
        ];

        $caLocations = [
            ['city' => 'San Francisco', 'state' => 'California', 'zip' => '94107', 'lat' => 37.7661, 'lng' => -122.3962],
            ['city' => 'San Jose', 'state' => 'California', 'zip' => '95112', 'lat' => 37.3402, 'lng' => -121.8795],
            ['city' => 'Santa Clara', 'state' => 'California', 'zip' => '95050', 'lat' => 37.3524, 'lng' => -121.9566],
            ['city' => 'Sunnyvale', 'state' => 'California', 'zip' => '94086', 'lat' => 37.3753, 'lng' => -122.0152],
            ['city' => 'Los Angeles', 'state' => 'California', 'zip' => '90012', 'lat' => 34.0601, 'lng' => -118.2384],
        ];

        $titles = [
            'Spacious Private Room in Premium Apartment',
            'Master Bedroom with Attached Bath available',
            'Fully Furnished Room near Public Transit',
            'Modern Suite in Luxury Building complex',
            'Quiet Room for Students or Working Professionals',
            'Bright and Airy Bedroom with great views',
            'Budget Friendly Room in Safe Neighborhood',
            'Awesome Roommate Wanted for 2B2B',
        ];

        $descriptions = [
            "We have a beautiful and clean room available for rent. The apartment is shared with friendly, working professionals. The rent includes high-speed internet and access to the building's pool and gym.",
            "Spacious master bedroom with plenty of closet space and a private en-suite bathroom. Looking for a clean and responsible roommate. Walking distance to grocery stores, restaurants, and transit.",
            "Perfect for a student or young professional. The room comes fully furnished with a comfortable bed, study desk, and chair. Shared kitchen and living area are fully equipped with modern appliances.",
            "Looking for an easy-going roommate to share our spacious apartment. The building has great amenities including a gym, co-working space, and rooftop access. No smoking or pets allowed.",
            "Newly renovated room with a private entrance and lots of natural light. Utilities (water, electricity, internet) are split evenly between roommates. Dedicated parking spot available for an extra monthly fee.",
        ];

        $users = User::inRandomOrder()->limit(50)->get();
        if ($users->isEmpty()) {
            $this->command->error("No users found to act as posters.");
            return;
        }

        // Helper to generate listings
        $generateListings = function ($locations, $count) use ($allImages, $imageCount, $destPath, $users, $titles, $descriptions) {
            for ($i = 0; $i < $count; $i++) {
                $location = $locations[array_rand($locations)];
                $user = $users->random();
                $isOwner = rand(0, 1);
                
                // Pick 2 to 4 random images
                $photoCount = rand(2, 4);
                $photos = [];
                for ($p = 0; $p < $photoCount; $p++) {
                    $sourceImage = $allImages[rand(0, $imageCount - 1)];
                    $filename = 'room_real_' . uniqid() . '.' . $sourceImage->getExtension();
                    File::copy($sourceImage->getRealPath(), $destPath . '/' . $filename);
                    $photos[] = 'storage/roommates/' . $filename;
                }
                
                $availableFrom = Carbon::now()->addDays(rand(1, 45));

                RoomMate::create([
                    'poster_id' => $user->id,
                    'poster_name' => $user->name,
                    'owner' => $isOwner,
                    'agent' => !$isOwner,
                    'location_state' => $location['state'],
                    'location_city' => $location['city'],
                    'location_zipcode' => $location['zip'],
                    'address' => rand(100, 9999) . ' ' . ['Main', 'Oak', 'Maple', 'Cedar', 'Pine'][rand(0, 4)] . ' St, ' . $location['city'],
                    'latitude' => $location['lat'] + (rand(-100, 100) / 10000), // slight randomization
                    'longitude' => $location['lng'] + (rand(-100, 100) / 10000),
                    'sharing_type' => rand(0, 1) ? 'Separate Room' : 'Share the room with other person',
                    'kitchen_available' => rand(0, 1),
                    'shared_bathroom' => rand(0, 1),
                    'rent' => rand(800, 2500),
                    'rent_frequency' => 'Monthly',
                    'utilities_included' => rand(0, 1),
                    'is_furnished' => rand(0, 1),
                    'photos' => $photos, // casted as array in model
                    'description' => $titles[array_rand($titles)] . " - " . $descriptions[array_rand($descriptions)],
                    'available_from' => $availableFrom,
                    'available_to' => $availableFrom->copy()->addMonths(rand(3, 12)),
                    'gender_preference' => ['Male', 'Female', 'Any'][rand(0, 2)],
                    'car_parking_available' => rand(0, 1),
                    'food_preference' => ['Veg', 'Non Veg', 'Any'][rand(0, 2)],
                    'washer_dryer' => rand(0, 1),
                    'status' => 'active'
                ]);
            }
        };

        // Generate the specified counts
        $generateListings($ilLocations, 25);
        $generateListings($njNyLocations, 30);
        $generateListings($caLocations, 30);
    }
}
