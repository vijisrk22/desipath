<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BusinessAccount;
use App\Models\LocalAd;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class TenRequestedLocalAdsSeeder extends Seeder
{
    public function run(): void
    {
        // Optional: Clean up existing ads from this seeder to avoid duplicates
        // LocalAd::query()->delete(); 

        $businessData = [
            [
                'user' => ['name' => 'Kevin Tech', 'email' => 'kevin.it@example.com'],
                'business' => ['name' => 'Desipath IT Academy', 'category' => 'IT & Technology', 'city' => 'Edison'],
                'ad' => ['title' => 'Master Full Stack Development', 'image' => 'storage/localads/tech_poster_ai_1777664107574.png']
            ],
            [
                'user' => ['name' => 'Lawyer Gupta', 'email' => 'gupta.legal@example.com'],
                'business' => ['name' => 'Gupta Legal & Tax', 'category' => 'Legal & Financial', 'city' => 'Jersey City'],
                'ad' => ['title' => 'Immigration & Business Legal Help', 'image' => 'storage/localads/legal_poster_1777664407181.png']
            ],
            [
                'user' => ['name' => 'Home Pro', 'email' => 'home.pro@example.com'],
                'business' => ['name' => 'Premium Home Services', 'category' => 'Home Services', 'city' => 'Princeton'],
                'ad' => ['title' => 'Plumbing, Electric & Landscaping', 'image' => 'storage/localads/landscaping_poster_1777664426962.png']
            ],
            [
                'user' => ['name' => 'Travel Expert', 'email' => 'travel.expert@example.com'],
                'business' => ['name' => 'Global Travel & Visa', 'category' => 'Travel & Immigration', 'city' => 'Edison'],
                'ad' => ['title' => 'Visa Processing & Flight Deals', 'image' => 'storage/localads/travel_poster_1777664490088.png']
            ],
            [
                'user' => ['name' => 'Event Star', 'email' => 'event.star@example.com'],
                'business' => ['name' => 'Star Event Management', 'category' => 'Events & Entertainment', 'city' => 'Jersey City'],
                'ad' => ['title' => 'Wedding & Party Planning Services', 'image' => 'storage/localads/events_poster_1777664511394.png']
            ],
            [
                'user' => ['name' => 'Dr. Smith', 'email' => 'dr.smith@example.com'],
                'business' => ['name' => 'Family Care Medical Center', 'category' => 'Healthcare', 'city' => 'Edison'],
                'ad' => ['title' => 'Complete Family Health Checkup', 'image' => 'storage/localads/dental_poster_1777664451706.png']
            ],
            [
                'user' => ['name' => 'Fresh Market', 'email' => 'fresh.market@example.com'],
                'business' => ['name' => 'Desi Grocery & Spice', 'category' => 'Grocery & Retail', 'city' => 'Jersey City'],
                'ad' => ['title' => 'Fresh Indian Groceries - 10% Off', 'image' => 'storage/localads/grocery_poster_ai_1777664132424.png']
            ],
            [
                'user' => ['name' => 'Wash Master', 'email' => 'wash.master@example.com'],
                'business' => ['name' => 'Sparkle Car Wash', 'category' => 'Other', 'city' => 'Edison'],
                'ad' => ['title' => 'Premium Interior & Exterior Wash', 'image' => 'storage/localads/auto_repair_poster_1777664362955.png']
            ],
            [
                'user' => ['name' => 'Car Dealer', 'email' => 'car.dealer@example.com'],
                'business' => ['name' => 'Reliable Pre-Owned Cars', 'category' => 'Other', 'city' => 'Princeton'],
                'ad' => ['title' => 'Certified Used Cars - Best Deals', 'image' => 'storage/localads/media__1777661774705.png']
            ],
            [
                'user' => ['name' => 'Burger King', 'email' => 'burger.desi@example.com'],
                'business' => ['name' => 'Desi Burger & Shakes', 'category' => 'Restaurant & Food', 'city' => 'Edison'],
                'ad' => ['title' => 'Buy One Get One Free Burger Deal', 'image' => 'storage/localads/restaurant_poster_ai_1777664087587.png']
            ],
        ];

        foreach ($businessData as $data) {
            // Check if user exists first to avoid duplicates
            $user = User::where('email', $data['user']['email'])->first();
            if (!$user) {
                $user = User::create([
                    'name' => $data['user']['name'],
                    'email' => $data['user']['email'],
                    'password' => Hash::make('Test123*'),
                ]);
            }

            $business = BusinessAccount::where('email', $data['user']['email'])->first();
            if (!$business) {
                $business = BusinessAccount::create([
                    'owner_user_id' => $user->id,
                    'business_name' => $data['business']['name'],
                    'category' => $data['business']['category'],
                    'owner_name' => $data['user']['name'],
                    'email' => $data['user']['email'],
                    'city' => $data['business']['city'],
                    'state_province' => 'NJ',
                    'country' => 'USA',
                    'account_status' => 'active',
                    'activated_at' => Carbon::now(),
                ]);
            }

            LocalAd::create([
                'business_account_id' => $business->id,
                'title' => $data['ad']['title'],
                'description' => "Professional services and exclusive deals from " . $data['business']['name'] . ". Visit us today for the best experience in " . $data['business']['category'] . ".",
                'category' => $data['business']['category'],
                'tags' => [$data['business']['category'], 'Special Offer', 'Local Deal'],
                'poster_urls' => [$data['ad']['image']],
                'location_city' => $data['business']['city'],
                'country' => 'USA',
                'status' => 'approved',
                'approved_at' => Carbon::now(),
                'expires_at' => Carbon::now()->addDays(30),
            ]);
        }
    }
}
