<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RentalHomesSeeder extends Seeder
{
    public function run()
    {
        DB::table('RentalHomes')->insert([
            [
                'property_type' => 'Apartment',
                'available_from' => Carbon::create('2024', '12', '01'),
                'area' => 1200.50,
                'deposit_rent' => 1000.00,
                'bhk' => '2 Bed 2 Bath',
                'address' => '789 Ocean Ave',
                'community_name' => 'Seaside Residences',
                'amenities' => 'Gym,Swimming Pool',
                'pets' => 1,
                'images' => 'apartment_image1.jpg,apartment_image2.jpg',
                'accommodates' => 4,
                'smoking' => 'Not okay',
                'owner_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'property_type' => 'Single family Home',
                'available_from' => Carbon::create('2024', '11', '20'),
                'area' => 2500.00,
                'deposit_rent' => 2000.00,
                'bhk' => '4 Bed 3 Bath',
                'address' => '123 Country Road',
                'community_name' => 'Country Estates',
                'amenities' => 'Gym,Club House',
                'pets' => 0,
                'images' => 'house_image1.jpg,house_image2.jpg',
                'accommodates' => 6,
                'smoking' => 'Ok',
                'owner_id' => 2,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            // Add more entries as needed
        ]);
    }
}
