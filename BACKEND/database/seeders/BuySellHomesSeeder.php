<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class BuySellHomesSeeder extends Seeder
{
    public function run()
    {
        $userIds = [1, 3, 4, 5];
        $homeTypes = ['Condominum', 'Single family', 'Town home'];
        $basementStatuses = ['Finished', 'Unfinished', 'Semi finished'];
        $locations = [
            ['city' => 'Oswego', 'state' => 'Illinois', 'zip' => '60543', 'address' => '123 Wolfs Crossing Rd'],
            ['city' => 'Aurora', 'state' => 'Illinois', 'key' => '60502', 'address' => '456 Eola Rd'],
            ['city' => 'Naperville', 'state' => 'Illinois', 'zip' => '60540', 'address' => '789 Washington St'],
            ['city' => 'Chicago', 'state' => 'Illinois', 'zip' => '60601', 'address' => '101 Michigan Ave'],
            ['city' => 'Plainfield', 'state' => 'Illinois', 'zip' => '60544', 'address' => '202 Lockport St']
        ];

        $images = [
            'avanterra-wolfs-crossing-oswego-il-primary-photo.png',
            '1002-beverly-ave-ocean-township-nj-primary-photo.jpg',
            '1035-stephen-ct-aurora-il-building-photo.jpg',
            '19947-cornice-st-spring-hill-ks-primary-photo.jpg',
            '229-1st-ave-manasquan-nj-primary-photo.jpg',
            '2704-telluride-ct-plainfield-il-primary-photo.jpg'
        ];

        foreach ($userIds as $userId) {
            $user = User::find($userId);
            if (!$user) continue;

            for ($i = 0; $i < 5; $i++) {
                $userType = $i % 2 == 0 ? 'Agent' : 'Owner';
                $price = rand(250000, 950000);
                $builtArea = rand(1500, 4500);
                $loc = $locations[$i % 5];

                DB::table('BuySellHomes')->insert([
                    'user_type' => $userType,
                    'company_name' => $userType === 'Agent' ? 'Desipath Realty' : null,
                    'home_type' => $homeTypes[rand(0, 2)],
                    'price' => $price,
                    'price_per_sqft' => round($price / $builtArea),
                    'built_area' => $builtArea,
                    'lot_size' => rand(5000, 15000),
                    'total_parking_spaces' => rand(1, 4),
                    'attached_garage' => rand(0, 1),
                    'hoa_fees' => rand(0, 500),
                    'year_built' => rand(1990, 2024),
                    'under_construction' => false,
                    'bedroom_total' => rand(2, 6),
                    'full_bathroom_total' => rand(2, 4),
                    'half_bathroom_total' => rand(0, 2),
                    'total_bathroom_total' => rand(2, 5),
                    'basement_size' => rand(0, 2000),
                    'basement_status' => $basementStatuses[rand(0, 2)],
                    'laundry_in_house' => true,
                    'home_level' => rand(1, 3),
                    'pool' => rand(0, 1),
                    'community_pool' => rand(0, 1),
                    'annual_tax_amount' => rand(4000, 15000),
                    'solar_setup' => rand(0, 1),
                    'kitchen_granite_countertop' => true,
                    'fireplace_count' => rand(0, 2),
                    'flooring' => 'Wood,Ceramic Tile',
                    'seller_id' => $userId,
                    'seller_name' => $user->name,
                    'location_city' => $loc['city'],
                    'location_state' => $loc['state'],
                    'location_zipcode' => $loc['zip'] ?? '60502',
                    'address' => $loc['address'],
                    'description' => "Beautiful " . $homeTypes[rand(0, 2)] . " in " . $loc['city'] . ". This home features modern amenities and a great location.",
                    'images' => json_encode(array_map(fn($img) => 'storage/buysellhomes/'.$img, [$images[rand(0, 5)], $images[rand(0, 5)]])),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
