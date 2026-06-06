<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BuySellHome;
use App\Models\User;
use Illuminate\Support\Facades\File;

class RealisticHomesSeeder extends Seeder
{
    public function run()
    {
        $users = User::pluck('id')->toArray();
        if (empty($users)) {
            $this->command->error("No users found in database to assign as sellers.");
            return;
        }

        $imagesDir = 'F:\Desipath-code\Homes';
        $images = File::exists($imagesDir) ? File::files($imagesDir) : [];
        $imageNames = [];

        // Ensure the destination storage directory exists
        $destDir = public_path('storage/houses');
        if (!File::exists($destDir)) {
            File::makeDirectory($destDir, 0755, true);
        }

        // Copy images to public/storage/houses
        foreach ($images as $img) {
            $fileName = $img->getFilename();
            File::copy($img->getPathname(), $destDir . '/' . $fileName);
            $imageNames[] = 'storage/houses/' . $fileName; // How it's typically stored in DB for this project
        }

        if (empty($imageNames)) {
            $this->command->warn("No images found in F:\\Desipath-code\\Homes. Will use empty arrays or placeholder.");
        }

        $caZipcodes = [
            '90210' => 'Beverly Hills', '94105' => 'San Francisco', '92101' => 'San Diego', 
            '90001' => 'Los Angeles', '95014' => 'Cupertino', '94043' => 'Mountain View',
            '92614' => 'Irvine', '95134' => 'San Jose', '95814' => 'Sacramento', '93710' => 'Fresno'
        ];

        $njZipcodes = [
            '07302' => 'Jersey City', '07030' => 'Hoboken', '08540' => 'Princeton', 
            '07102' => 'Newark', '08901' => 'New Brunswick', '08817' => 'Edison',
            '07002' => 'Bayonne', '08034' => 'Cherry Hill', '07601' => 'Hackensack', '07011' => 'Clifton'
        ];

        $homeTypes = ['Single Family', 'Condominium', 'Townhouse', 'Apartment', 'Multi-Family'];

        // Generate 50 CA Homes
        for ($i = 0; $i < 50; $i++) {
            $zip = array_rand($caZipcodes);
            $city = $caZipcodes[$zip];
            $this->createHome($users, $imageNames, 'CA', $city, $zip);
        }

        // Generate 50 NJ Homes
        for ($i = 0; $i < 50; $i++) {
            $zip = array_rand($njZipcodes);
            $city = $njZipcodes[$zip];
            $this->createHome($users, $imageNames, 'NJ', $city, $zip);
        }

        $this->command->info("Successfully seeded 50 CA homes and 50 NJ homes.");
    }

    private function createHome($users, $imageNames, $state, $city, $zip)
    {
        $homeTypes = ['Condominum', 'Single family', 'Town home'];
        $homeType = $homeTypes[array_rand($homeTypes)];
        
        // Grab 1 to 4 random images
        $homeImages = [];
        if (!empty($imageNames)) {
            $numImages = rand(1, min(4, count($imageNames)));
            $keys = (array) array_rand($imageNames, $numImages);
            foreach ($keys as $k) {
                $homeImages[] = '/' . $imageNames[$k]; // Adding slash based on earlier discovery
            }
        }

        $price = rand(300, 2500) * 1000; // 300k to 2.5m
        $builtArea = rand(800, 4500);

        BuySellHome::create([
            'user_type' => rand(0, 1) ? 'Agent' : 'Owner',
            'home_type' => $homeType,
            'price' => $price,
            'price_per_sqft' => round($price / $builtArea),
            'built_area' => $builtArea,
            'lot_size' => $builtArea * rand(1, 3),
            'total_parking_spaces' => rand(1, 4),
            'attached_garage' => rand(0, 1),
            'hoa_fees' => rand(0, 500),
            'year_built' => rand(1950, 2024),
            'under_construction' => rand(0, 1),
            'bedroom_total' => rand(1, 6),
            'half_bathroom_total' => rand(0, 2),
            'full_bathroom_total' => rand(1, 4),
            'total_bathroom_total' => rand(1, 5),
            'basement_size' => rand(0, 1000),
            'basement_status' => rand(0, 1) ? 'Finished' : 'Unfinished',
            'laundry_in_house' => rand(0, 1),
            'home_level' => rand(1, 3),
            'pool' => rand(0, 1),
            'community_pool' => rand(0, 1),
            'annual_tax_amount' => rand(2000, 15000),
            'images' => $homeImages,
            'description' => "Beautiful $homeType located in $city, $state. Features modern amenities, spacious layout, and close to top-rated schools.",
            'kitchen_granite_countertop' => rand(0, 1),
            'solar_setup' => rand(0, 1),
            'fireplace_count' => rand(0, 2),
            'flooring' => 'Hardwood',
            'seller_id' => $users[array_rand($users)],
            'location_state' => $state,
            'location_city' => $city,
            'location_zipcode' => $zip,
            'latitude' => null,
            'longitude' => null,
            'seller_name' => "Real Estate Agent",
            'address' => rand(100, 9999) . ' Main St',
            'company_name' => 'Desipath Realty',
            'status' => 'Active',
        ]);
    }
}
