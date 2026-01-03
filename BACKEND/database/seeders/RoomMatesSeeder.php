<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RoomMatesSeeder extends Seeder
{
    public function run()
    {
        DB::table('RoomMates')->insert([
            [
                'owner' => 1,
                'agent' => 0,
                'location_state' => 'California',
                'location_city' => 'San Francisco',
                'location_zipcode' => '94103',
                'sharing_type' => 'Separate Room',
                'kitchen_available' => 1,
                'shared_bathroom' => 0,
                'rent' => 800.00,
                'rent_frequency' => 'Monthly',
                'utilities_included' => 1,
                'photos' => 'room_photo1.jpg,room_photo2.jpg',
                'available_from' => Carbon::create('2024', '12', '01'),
                'available_to' => Carbon::create('2025', '05', '01'),
                'gender_preference' => 'Any',
                'car_parking_available' => 1,
                'food_preference' => 'Any',
                'washer_dryer' => 1,
                'poster_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'owner' => 0,
                'agent' => 1,
                'location_state' => 'Texas',
                'location_city' => 'Austin',
                'location_zipcode' => '78701',
                'sharing_type' => 'Share the room with other person',
                'kitchen_available' => 1,
                'shared_bathroom' => 1,
                'rent' => 600.00,
                'rent_frequency' => 'Weekly',
                'utilities_included' => 0,
                'photos' => 'roommate_photo1.jpg,roommate_photo2.jpg',
                'available_from' => Carbon::create('2024', '11', '15'),
                'available_to' => Carbon::create('2025', '04', '15'),
                'gender_preference' => 'Female',
                'car_parking_available' => 0,
                'food_preference' => 'Veg',
                'washer_dryer' => 1,
                'poster_id' => 2,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            // Add more entries as needed
        ]);
    }
}
