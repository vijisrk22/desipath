<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BusinessAccount;
use App\Models\LocalAd;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class BulkLocalAdsSeeder extends Seeder
{
    public function run(): void
    {
        $usersData = [
            ['name' => 'Vijay Sam', 'email' => 'Vijay123@sharklasers.com', 'category' => 'Grocery & Retail'],
            ['name' => 'Sam Rajesh', 'email' => 'Sam123@sharklasers.com', 'category' => 'Beauty & Wellness'],
            ['name' => 'Ram Kumar', 'email' => 'Ram123@sharklasers.com', 'category' => 'Restaurant & Food'],
            ['name' => 'Binoy Varghese', 'email' => 'binoy123@sharklasers.com', 'category' => 'Education & Tutoring'],
            ['name' => 'Hilton Kumar', 'email' => 'Hilton123@sharklasers.com', 'category' => 'Other'],
            ['name' => 'Muthu Kumar', 'email' => 'Muthu123@sharklasers.com', 'category' => 'IT & Technology'],
            ['name' => 'Ferry Sam', 'email' => 'Ferry123@sharklasers.com', 'category' => 'Restaurant & Food'],
            ['name' => 'Henry George', 'email' => 'Henry123@sharklasers.com', 'category' => 'Beauty & Wellness'],
            ['name' => 'George John', 'email' => 'George123@sharklasers.com', 'category' => 'Grocery & Retail'],
            ['name' => 'Uma Desai', 'email' => 'uma123@sharklasers.com', 'category' => 'Beauty & Wellness'],
            ['name' => 'Paul Kumar', 'email' => 'paul123@sharklasers.com', 'category' => 'Restaurant & Food'],
            ['name' => 'Wisley Kutty', 'email' => 'wisley123@sharkalasers.com', 'category' => 'Education & Tutoring'],
            ['name' => 'Cathey Tommy', 'email' => 'tommy123@sharklasers.com', 'category' => 'Other'],
            ['name' => 'Daniel Shankar', 'email' => 'daniel123@sharklasers.com', 'category' => 'IT & Technology'],
        ];

        $imageMap = [
            'Grocery & Retail' => ['storage/localads/grocery_1.png', 'storage/localads/grocery_2.png'],
            'Beauty & Wellness' => ['storage/localads/salon_1.png', 'storage/localads/salon_2.png'],
            'Restaurant & Food' => ['storage/localads/restaurant_1.png', 'storage/localads/restaurant_2.png'],
            'Education & Tutoring' => ['storage/localads/training_1.png', 'storage/localads/training_2.png'],
            'Other' => ['storage/localads/automotive_1.png', 'storage/localads/automotive_2.png'],
            'IT & Technology' => ['storage/localads/electronics_1.png', 'storage/localads/electronics_2.png'],
            'Bakery' => ['storage/localads/bakery_1.png', 'storage/localads/bakery_2.png'],
            'Yoga' => ['storage/localads/yoga_1.png', 'storage/localads/yoga_2.png'],
        ];

        foreach ($usersData as $data) {
            $user = User::where('email', $data['email'])->first();
            
            if (!$user) {
                // Should not happen based on previous check, but for safety:
                $user = User::create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => Hash::make('Test123*'),
                ]);
            }

            // Create Business Account if missing
            $business = BusinessAccount::where('owner_user_id', $user->id)->first();
            if (!$business) {
                $business = BusinessAccount::create([
                    'owner_user_id' => $user->id,
                    'business_name' => $data['name'] . "'s " . $data['category'],
                    'category' => $data['category'],
                    'owner_name' => $data['name'],
                    'email' => $data['email'],
                    'city' => 'Edison',
                    'state_province' => 'NJ',
                    'country' => 'USA',
                    'account_status' => 'active',
                    'activated_at' => Carbon::now(),
                ]);
            }

            // Create 2 Ads
            $images = $imageMap[$data['category']];

            for ($i = 1; $i <= 2; $i++) {
                LocalAd::create([
                    'business_account_id' => $business->id,
                    'title' => "Special Offer from " . $data['name'] . " - Deal #" . $i,
                    'description' => "Get the best deals on " . strtolower($data['category']) . " services and products. Contact us today for more information! This is a simulated business advertisement for demonstration purposes.",
                    'category' => $data['category'],
                    'tags' => [$data['category'], 'Special', 'Deal'],
                    'poster_urls' => $images, // Both images per ad as requested
                    'location_city' => 'Edison',
                    'country' => 'USA',
                    'status' => 'approved',
                    'approved_at' => Carbon::now(),
                    'expires_at' => Carbon::now()->addDays(30),
                ]);
            }
        }
    }
}
