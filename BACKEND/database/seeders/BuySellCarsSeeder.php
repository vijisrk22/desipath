<?php

// database/seeders/BuySellCarsSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use DB;

class BuySellCarsSeeder extends Seeder
{
    public function run()
    {
        DB::table('BuySellCars')->insert([
            [
                'make' => 'Toyota',
                'model' => 'Camry',
                'year' => 2020,
                'miles' => 15000,
                'variant' => 'Hybrid',
                'pictures' => json_encode(['pic1.jpg', 'pic2.jpg']),
                'location' => 'New York',
                'seller_id' => 1,
                'price' => 25000.00,
                'description' => 'Well-maintained, single owner.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Add more records if needed
        ]);
    }
}
