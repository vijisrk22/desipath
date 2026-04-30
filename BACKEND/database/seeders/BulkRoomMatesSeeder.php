<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RoomMate;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class BulkRoomMatesSeeder extends Seeder
{
    public function run(): void
    {
        $usersEmails = [
            'Vijay123@sharklasers.com',
            'Sam123@sharklasers.com',
            'Ram123@sharklasers.com',
            'binoy123@sharklasers.com',
            'Hilton123@sharklasers.com',
            'Muthu123@sharklasers.com',
            'Ferry123@sharklasers.com',
            'Henry123@sharklasers.com',
            'George123@sharklasers.com',
            'uma123@sharklasers.com',
            'paul123@sharklasers.com',
            'wisley123@sharkalasers.com',
            'tommy123@sharklasers.com',
            'daniel123@sharklasers.com',
        ];

        $sourcePath = 'F:\\Desipath-code\\Room1';
        $destPath = storage_path('app/public/roommates');

        if (!File::exists($destPath)) {
            File::makeDirectory($destPath, 0755, true);
        }

        $allImages = File::files($sourcePath);
        $imageCount = count($allImages);
        $imageIndex = 0;

        $locations = [
            ['city' => 'Edison', 'state' => 'New Jersey', 'zip' => '08817'],
            ['city' => 'Edison', 'state' => 'New Jersey', 'zip' => '08820'],
            ['city' => 'Jersey City', 'state' => 'New Jersey', 'zip' => '07302'],
            ['city' => 'Jersey City', 'state' => 'New Jersey', 'zip' => '07306'],
            ['city' => 'New York', 'state' => 'New York', 'zip' => '10001'],
            ['city' => 'New York', 'state' => 'New York', 'zip' => '10002'],
            ['city' => 'Princeton', 'state' => 'New Jersey', 'zip' => '08540'],
            ['city' => 'New Brunswick', 'state' => 'New Jersey', 'zip' => '08901'],
        ];

        $titles = [
            'Cozy Private Room in Shared Apartment',
            'Master Bedroom with Attached Bath',
            'Spacious Room near Public Transport',
            'Modern Suite in Luxury Building',
            'Quiet Room for Students or Professionals',
            'Bright and Airy Bedroom in Downtown',
            'Furnished Room with All Amenities',
            'Budget Friendly Room in Safe Neighborhood',
        ];

        $descriptions = [
            'A beautiful and clean room available for rent. The apartment is shared with friendly professionals. Includes high-speed internet and all utilities.',
            'Spacious master bedroom with plenty of closet space. Looking for a clean and responsible roommate. Walking distance to grocery stores and transit.',
            'Perfect for a student or young professional. The room comes with a bed and desk. Shared kitchen and living area are fully equipped.',
            'Looking for a roommate to share our 2-bedroom apartment. The building has a gym and rooftop access. No smoking or pets allowed.',
            'Newly renovated room with private entrance. Utilities are split between roommates. Parking spot available for an extra fee.',
        ];

        foreach ($usersEmails as $email) {
            $user = User::where('email', $email)->first();
            if (!$user) continue;

            for ($i = 0; $i < 3; $i++) {
                $location = $locations[array_rand($locations)];
                $isOwner = rand(0, 1);
                
                // Copy image
                $sourceImage = $allImages[$imageIndex % $imageCount];
                $imageIndex++;
                $filename = 'room_' . uniqid() . '.' . $sourceImage->getExtension();
                File::copy($sourceImage->getRealPath(), $destPath . '/' . $filename);
                
                $availableFrom = Carbon::now()->addDays(rand(1, 30));

                RoomMate::create([
                    'poster_id' => $user->id,
                    'poster_name' => $user->name,
                    'owner' => $isOwner,
                    'agent' => !$isOwner,
                    'location_state' => $location['state'],
                    'location_city' => $location['city'],
                    'location_zipcode' => $location['zip'],
                    'address' => rand(100, 999) . ' Main St, ' . $location['city'],
                    'sharing_type' => rand(0, 1) ? 'Separate Room' : 'Share the room with other person',
                    'kitchen_available' => rand(0, 1),
                    'shared_bathroom' => rand(0, 1),
                    'rent' => rand(600, 1500),
                    'rent_frequency' => 'Monthly',
                    'utilities_included' => rand(0, 1),
                    'is_furnished' => rand(0, 1),
                    'photos' => ['storage/roommates/' . $filename],
                    'description' => $descriptions[array_rand($descriptions)],
                    'available_from' => $availableFrom,
                    'available_to' => $availableFrom->copy()->addMonths(rand(3, 12)),
                    'gender_preference' => ['Male', 'Female', 'Any'][rand(0, 2)],
                    'car_parking_available' => rand(0, 1),
                    'food_preference' => ['Veg', 'Non Veg', 'Any'][rand(0, 2)],
                    'washer_dryer' => rand(0, 1),
                    'status' => 'active'
                ]);
            }
        }
    }
}
