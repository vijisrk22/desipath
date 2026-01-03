<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ClassesForKidsAdsSeeder extends Seeder
{
    public function run()
    {
        DB::table('ClassesforKidsAds')->insert([
            [
                'user_id' => 1,
                'class_type' => 'Dance',
                'address' => '123 Main St',
                'state' => 'California',
                'city' => 'Los Angeles',
                'description' => 'A fun dance class for kids.',
                'image' => 'dance_class.jpg',
                'start_date' => Carbon::create('2024', '11', '20'),
                'price' => 50.00,
                'language_specific' => 1,
                'language' => 'English,Hindi',
                'contact_form' => '{"email": "contact@example.com", "phone": "123-456-7890"}',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'user_id' => 2,
                'class_type' => 'Art',
                'address' => '456 Maple Ave',
                'state' => 'Texas',
                'city' => 'Dallas',
                'description' => 'An art class for creative kids.',
                'image' => 'art_class.jpg',
                'start_date' => Carbon::create('2024', '12', '15'),
                'price' => 30.00,
                'language_specific' => 0,
                'language' => 'Tamil,Telugu',
                'contact_form' => '{"email": "artclass@example.com", "phone": "987-654-3210"}',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            // Add more entries as needed
        ]);
    }
}
