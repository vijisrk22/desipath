<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RealEstateSeeder extends Seeder
{
    public function run()
    {
        $properties = [
            [
                'user_id' => 1,
                'title' => 'Luxury 3BHK Apartment in South Mumbai',
                'description' => 'A stunning 3BHK apartment with panoramic sea views, modern amenities, and premium finishes. Located in the heart of South Mumbai.',
                'property_type' => 'Apartment',
                'country' => 'India',
                'city' => 'Mumbai',
                'state' => 'Maharashtra',
                'price' => 75000000, // 7.5 Cr
                'currency' => 'INR',
                'area_sqft' => 2400,
                'bedrooms' => 3,
                'bathrooms' => 3,
                'agent_name' => 'Rajesh Sharma',
                'agent_company' => 'Mumbai Realty Experts',
                'main_image' => 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
                'features' => json_encode(['Sea View', 'Gym', 'Parking', '24/7 Security']),
                'status' => 'approved',
            ],
            [
                'user_id' => 1,
                'title' => 'Futuristic 5-Bedroom Villa in Palm Jumeirah',
                'description' => 'Experience the ultimate luxury lifestyle in this ultra-modern 5-bedroom villa with a private infinity pool and direct beach access.',
                'property_type' => 'Villa',
                'country' => 'Dubai',
                'city' => 'Dubai',
                'state' => 'Dubai',
                'price' => 4500000,
                'currency' => 'AED',
                'area_sqft' => 6500,
                'bedrooms' => 5,
                'bathrooms' => 6,
                'agent_name' => 'Michael Scott',
                'agent_company' => 'Dubai Gold Estates',
                'main_image' => 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
                'features' => json_encode(['Private Pool', 'Beach Access', 'Smart Home', 'Home Theater']),
                'status' => 'approved',
            ],
            [
                'user_id' => 1,
                'title' => 'Contemporary Individual House in Bangalore',
                'description' => 'Modern individual house with a private garden and rooftop terrace in a quiet residential area of Bangalore.',
                'property_type' => 'Individual House',
                'country' => 'India',
                'city' => 'Bangalore',
                'state' => 'Karnataka',
                'price' => 35000000,
                'currency' => 'INR',
                'area_sqft' => 3200,
                'bedrooms' => 4,
                'bathrooms' => 4,
                'agent_name' => 'Suresh Kumar',
                'agent_company' => 'Garden City Homes',
                'main_image' => 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
                'features' => json_encode(['Private Garden', 'Terrace', 'Solar Power']),
                'status' => 'approved',
            ],
            [
                'user_id' => 1,
                'title' => 'Elite Apartment in Downtown Dubai',
                'description' => 'Sophisticated apartment overlooking the Burj Khalifa. High-floor unit with world-class facilities.',
                'property_type' => 'Apartment',
                'country' => 'Dubai',
                'city' => 'Dubai',
                'state' => 'Dubai',
                'price' => 2800000,
                'currency' => 'AED',
                'area_sqft' => 1800,
                'bedrooms' => 2,
                'bathrooms' => 2,
                'agent_name' => 'Sarah Connor',
                'agent_company' => 'Prime Dubai Properties',
                'main_image' => 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
                'features' => json_encode(['City View', 'Pool', 'Concierge']),
                'status' => 'approved',

            ]
        ];

        foreach ($properties as $prop) {
            $prop['slug'] = Str::slug($prop['title']) . '-' . Str::random(5);
            $prop['created_at'] = now();
            $prop['updated_at'] = now();
            DB::table('real_estate_ads')->insert($prop);
        }
    }
}
