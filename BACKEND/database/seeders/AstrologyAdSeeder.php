<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AstrologyAdSeeder extends Seeder
{
    public function run()
    {
        $users = [
            ['id' => 3, 'name' => 'Vijay Sam', 'email' => 'Vijay123@sharklasers.com'],
            ['id' => 4, 'name' => 'Sam Rajesh', 'email' => 'Sam123@sharklasers.com'],
            ['id' => 5, 'name' => 'Ram Kumar', 'email' => 'Ram123@sharklasers.com'],
            ['id' => 6, 'name' => 'Binoy Varghese', 'email' => 'binoy123@sharklasers.com'],
            ['id' => 7, 'name' => 'Hilton Kumar', 'email' => 'Hilton123@sharklasers.com'],
            ['id' => 8, 'name' => 'Muthu Kumar', 'email' => 'Muthu123@sharklasers.com'],
            ['id' => 9, 'name' => 'Ferry Sam', 'email' => 'Ferry123@sharklasers.com'],
            ['id' => 10, 'name' => 'Henry George', 'email' => 'Henry123@sharklasers.com'],
            ['id' => 11, 'name' => 'George John', 'email' => 'George123@sharklasers.com'],
            ['id' => 12, 'name' => 'Uma Desai', 'email' => 'uma123@sharklasers.com'],
            ['id' => 13, 'name' => 'Paul Kumar', 'email' => 'paul123@sharklasers.com'],
            ['id' => 14, 'name' => 'Wisley Kutty', 'email' => 'wisley123@sharkalasers.com'],
            ['id' => 15, 'name' => 'Cathey Tommy', 'email' => 'tommy123@sharklasers.com'],
            ['id' => 16, 'name' => 'Daniel Shankar', 'email' => 'daniel123@sharklasers.com'],
        ];

        $countries = ['India', 'UAE'];
        $cities = [
            'India' => ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune'],
            'UAE' => ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman']
        ];
        $specializations = ["Vedic Astrology", "Horoscope", "Birth Chart", "Nadi Astrology", "Numerology", "Tarot Card Reading", "Palm Reading", "Vastu for Home"];

        foreach ($users as $index => $user) {
            $country = $countries[$index % 2];
            $city = $cities[$country][array_rand($cities[$country])];
            $imgNum = ($index % 4) + 1;
            
            $adId = DB::table('AstrologyAds')->insertGetId([
                'user_id' => $user['id'],
                'slug' => Str::slug($user['name'] . '-' . Str::random(5)),
                'display_name' => $user['name'],
                'experience_years' => rand(5, 25),
                'tagline' => 'Expert Guidance for a Better Tomorrow',
                'astrologer_type' => 'Expert',
                'address' => 'Main Street ' . rand(10, 99),
                'city' => $city,
                'state' => $country === 'India' ? 'Maharashtra' : 'Dubai',
                'country' => $country,
                'phone' => '+1' . rand(100000000, 999999999),
                'email' => $user['email'],
                'description' => "With over " . rand(5, 25) . " years of experience, " . $user['name'] . " provides accurate readings and spiritual guidance. Specializing in various astrological sciences to help you navigate life's challenges.",
                'certifications' => 'Certified Vedic Astrologer, MA in Astrology',
                'status' => 'approved',
                'price' => rand(30, 150),
                'profile_pic_url' => "/storage/astrology/pandit_{$imgNum}.png",
                'consultation_modes' => json_encode(['Phone', 'Video', 'Chat']),
                'services_json' => json_encode([$specializations[array_rand($specializations)], $specializations[array_rand($specializations)]]),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Add Packages
            DB::table('astrology_packages')->insert([
                [
                    'astrology_ad_id' => $adId,
                    'name' => 'Quick Consultation',
                    'duration' => '15 Mins',
                    'price' => rand(20, 40),
                    'description' => 'Fast answers to your urgent questions.',
                    'is_popular' => false,
                    'created_at' => now(),
                ],
                [
                    'astrology_ad_id' => $adId,
                    'name' => 'Deep Analysis',
                    'duration' => '45 Mins',
                    'price' => rand(60, 120),
                    'description' => 'Comprehensive look at your birth chart and future predictions.',
                    'is_popular' => true,
                    'created_at' => now(),
                ]
            ]);
        }
    }
}
