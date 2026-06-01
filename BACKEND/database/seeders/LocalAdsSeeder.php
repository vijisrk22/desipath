<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BusinessAccount;
use App\Models\LocalAd;
use App\Models\User;
use Carbon\Carbon;

class LocalAdsSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();
        if (!$user) {
            $user = User::create([
                'name' => 'Demo Business Owner',
                'email' => 'business@example.com',
                'password' => \Hash::make('password'),
            ]);
        }

        $business = BusinessAccount::create([
            'owner_user_id' => $user->id,
            'business_name' => 'Royal Indian Cuisine',
            'category' => 'Restaurant & Food',
            'owner_name' => 'Raj Patel',
            'email' => 'contact@royalindian.com',
            'phone' => '732-555-0123',
            'city' => 'Edison',
            'state_province' => 'NJ',
            'country' => 'USA',
            'website_url' => 'https://royalindian.com',
            'bio' => 'Authentic Indian flavors since 1995.',
            'account_status' => 'active',
            'activated_at' => Carbon::now(),
        ]);

        LocalAd::create([
            'business_account_id' => $business->id,
            'title' => 'Weekend Buffet Special',
            'description' => 'Unlimited food for just $19.99! Join us this Saturday and Sunday for the best Indian buffet in Edison.',
            'category' => 'Restaurant & Food',
            'tags' => ['Buffet', 'Indian', 'Weekend'],
            'poster_urls' => ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'],
            'location_city' => 'Edison',
            'country' => 'USA',
            'status' => 'approved',
            'approved_at' => Carbon::now(),
            'expires_at' => Carbon::now()->addDays(15),
        ]);

        LocalAd::create([
            'business_account_id' => $business->id,
            'title' => 'Diwali Sweets Pre-order',
            'description' => 'Freshly made Diwali sweets now available for pre-order. Kaju Katli, Ladoo, and more!',
            'category' => 'Restaurant & Food',
            'tags' => ['Sweets', 'Diwali', 'Festival'],
            'poster_urls' => ['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80'],
            'location_city' => 'Jersey City',
            'country' => 'USA',
            'status' => 'pending',
        ]);
        
        $business2 = BusinessAccount::create([
            'owner_user_id' => $user->id,
            'business_name' => 'Patel Brothers',
            'category' => 'Grocery & Retail',
            'owner_name' => 'Sam Patel',
            'email' => 'sales@patelbros.com',
            'city' => 'Jersey City',
            'state_province' => 'NJ',
            'country' => 'USA',
            'account_status' => 'active',
        ]);

        LocalAd::create([
            'business_account_id' => $business2->id,
            'title' => 'Mango Sale - 20% Off',
            'description' => 'Premium Alphonso mangoes now 20% off. Limited stock!',
            'category' => 'Grocery & Retail',
            'tags' => ['Mango', 'Grocery', 'Sale'],
            'poster_urls' => ['https://images.unsplash.com/photo-1604719312563-8912e9223c6a?auto=format&fit=crop&w=800&q=80'],
            'location_city' => 'Jersey City',
            'country' => 'USA',
            'status' => 'approved',
            'approved_at' => Carbon::now(),
            'expires_at' => Carbon::now()->addDays(15),
        ]);
    }
}
