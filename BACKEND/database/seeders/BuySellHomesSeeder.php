<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BuySellHomesSeeder extends Seeder
{
    public function run()
    {
        DB::table('BuySellHomes')->insert([
            [
                'user_type' => 'Agent',
                'home_type' => 'Single family',
                'price' => 350000.00,
                'built_area' => 2000.00,
                'lot_size' => 3000.00,
                'hoa_fees' => 150.00,
                'year_built' => 2015,
                'under_construction' => false,
                'bedroom_total' => 4,
                'half_bathroom_total' => 1,
                'full_bathroom_total' => 2,
                'basement_size' => 500.00,
                'basement_status' => 'Finished',
                'laundry_in_house' => true,
                'home_level' => 2,
                'pool' => true,
                'annual_tax_amount' => 3000.00,
                'images' => json_encode(['image1.jpg', 'image2.jpg']),
                'description' => 'Beautiful single-family home located in a great neighborhood.',
                'kitchen_granite_countertop' => true,
                'fireplace_count' => 1,
                'flooring' => 'Wood,Carpet',
                'seller_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // Additional entries can be added here
        ]);
    }
}
