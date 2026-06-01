<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UsaZipcode;

class UsaZipcodeManualSeeder extends Seeder
{
    public function run(): void
    {
        $locations = [
            ['zip' => '10001', 'city' => 'New York', 'state_id' => 'NY', 'state_name' => 'New York', 'lat' => 40.7501, 'lng' => -73.9996],
            ['zip' => '90001', 'city' => 'Los Angeles', 'state_id' => 'CA', 'state_name' => 'California', 'lat' => 33.9731, 'lng' => -118.2479],
            ['zip' => '60601', 'city' => 'Chicago', 'state_id' => 'IL', 'state_name' => 'Illinois', 'lat' => 41.8858, 'lng' => -87.625],
            ['zip' => '77001', 'city' => 'Houston', 'state_id' => 'TX', 'state_name' => 'Texas', 'lat' => 29.7604, 'lng' => -95.3698],
            ['zip' => '85001', 'city' => 'Phoenix', 'state_id' => 'AZ', 'state_name' => 'Arizona', 'lat' => 33.4484, 'lng' => -112.074],
            ['zip' => '19101', 'city' => 'Philadelphia', 'state_id' => 'PA', 'state_name' => 'Pennsylvania', 'lat' => 39.9526, 'lng' => -75.1652],
            ['zip' => '78201', 'city' => 'San Antonio', 'state_id' => 'TX', 'state_name' => 'Texas', 'lat' => 29.4241, 'lng' => -98.4936],
            ['zip' => '92101', 'city' => 'San Diego', 'state_id' => 'CA', 'state_name' => 'California', 'lat' => 32.7157, 'lng' => -117.1611],
            ['zip' => '75201', 'city' => 'Dallas', 'state_id' => 'TX', 'state_name' => 'Texas', 'lat' => 32.7767, 'lng' => -96.797],
            ['zip' => '95101', 'city' => 'San Jose', 'state_id' => 'CA', 'state_name' => 'California', 'lat' => 37.3382, 'lng' => -121.8863],
        ];

        foreach ($locations as $loc) {
            UsaZipcode::updateOrCreate(['zip' => $loc['zip']], array_merge($loc, [
                'timezone' => 'America/Chicago', // Placeholder
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
