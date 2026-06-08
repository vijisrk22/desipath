<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RealEstateSeeder extends Seeder
{
    public function run()
    {
        $indianCities = ['Mumbai' => 'Maharashtra', 'Bangalore' => 'Karnataka', 'Delhi' => 'Delhi', 'Chennai' => 'Tamil Nadu', 'Hyderabad' => 'Telangana'];
        $uaeCities = ['Dubai' => 'Dubai', 'Abu Dhabi' => 'Abu Dhabi', 'Sharjah' => 'Sharjah'];
        $usaCities = ['New York' => 'New York', 'San Francisco' => 'California', 'Austin' => 'Texas'];

        $propertyTypes = ['Apartment', 'Individual House', 'Villa', 'Penthouse'];
        $agentNames = ['Rajesh Sharma', 'Michael Scott', 'Suresh Kumar', 'Sarah Connor', 'Anita Desai', 'John Doe'];
        $agentCompanies = ['Mumbai Realty', 'Dubai Estates', 'Garden City Homes', 'Prime Properties', 'Global Homes', 'Skyline Realty'];

        $images = [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
            'https://images.unsplash.com/photo-1600607687931-cebf58cb802f?w=800&q=80',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
            'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80',
            'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80',
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'
        ];

        // India Properties
        for ($i = 0; $i < 20; $i++) {
            $city = array_rand($indianCities);
            $state = $indianCities[$city];
            $type = $propertyTypes[array_rand($propertyTypes)];
            $bedrooms = rand(2, 5);
            $prop = [
                'user_id' => 1,
                'title' => "Beautiful $bedrooms BHK $type in $city",
                'description' => "Spacious and luxurious $type located in a prime area of $city. Offers modern amenities and great connectivity.",
                'property_type' => $type,
                'country' => 'India',
                'city' => $city,
                'state' => $state,
                'price' => rand(50, 500) * 100000, // 50 Lakhs to 5 Cr
                'currency' => 'INR',
                'area_sqft' => rand(1000, 4000),
                'bedrooms' => $bedrooms,
                'bathrooms' => $bedrooms,
                'agent_name' => $agentNames[array_rand($agentNames)],
                'agent_company' => $agentCompanies[array_rand($agentCompanies)],
                'main_image' => $images[array_rand($images)],
                'features' => json_encode(['Gym', 'Parking', 'Security', 'Power Backup']),
                'status' => 'approved',
                'slug' => Str::slug("Beautiful $bedrooms BHK $type in $city") . '-' . Str::random(8),
                'created_at' => now(),
                'updated_at' => now(),
            ];
            DB::table('real_estate_ads')->insert($prop);
        }

        // UAE Properties
        for ($i = 0; $i < 15; $i++) {
            $city = array_rand($uaeCities);
            $state = $uaeCities[$city];
            $type = $propertyTypes[array_rand($propertyTypes)];
            $bedrooms = rand(2, 5);
            $prop = [
                'user_id' => 1,
                'title' => "Luxury $bedrooms Bed $type in $city",
                'description' => "Stunning $type with amazing views and world class facilities in $city.",
                'property_type' => $type,
                'country' => 'Dubai',
                'city' => $city,
                'state' => $state,
                'price' => rand(100, 800) * 10000, // 1M to 8M AED
                'currency' => 'AED',
                'area_sqft' => rand(1500, 6000),
                'bedrooms' => $bedrooms,
                'bathrooms' => $bedrooms + 1,
                'agent_name' => $agentNames[array_rand($agentNames)],
                'agent_company' => $agentCompanies[array_rand($agentCompanies)],
                'main_image' => $images[array_rand($images)],
                'features' => json_encode(['Pool', 'Gym', 'Concierge', 'Sea View']),
                'status' => 'approved',
                'slug' => Str::slug("Luxury $bedrooms Bed $type in $city") . '-' . Str::random(8),
                'created_at' => now(),
                'updated_at' => now(),
            ];
            DB::table('real_estate_ads')->insert($prop);
        }

        // USA Properties
        for ($i = 0; $i < 15; $i++) {
            $city = array_rand($usaCities);
            $state = $usaCities[$city];
            $type = $propertyTypes[array_rand($propertyTypes)];
            $bedrooms = rand(2, 5);
            $prop = [
                'user_id' => 1,
                'title' => "Modern $bedrooms Bed $type in $city",
                'description' => "Contemporary $type in the heart of $city with top-rated schools nearby.",
                'property_type' => $type,
                'country' => 'USA',
                'city' => $city,
                'state' => $state,
                'price' => rand(30, 250) * 10000, // 300k to 2.5M USD
                'currency' => 'USD',
                'area_sqft' => rand(1200, 5000),
                'bedrooms' => $bedrooms,
                'bathrooms' => $bedrooms,
                'agent_name' => $agentNames[array_rand($agentNames)],
                'agent_company' => $agentCompanies[array_rand($agentCompanies)],
                'main_image' => $images[array_rand($images)],
                'features' => json_encode(['Backyard', 'Garage', 'Smart Home']),
                'status' => 'approved',
                'slug' => Str::slug("Modern $bedrooms Bed $type in $city") . '-' . Str::random(8),
                'created_at' => now(),
                'updated_at' => now(),
            ];
            DB::table('real_estate_ads')->insert($prop);
        }
    }
}
