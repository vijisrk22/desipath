<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BusinessAccount;
use App\Models\LocalAd;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class TenMoreLocalAdsSeeder extends Seeder
{
    public function run(): void
    {
        $businessData = [
            [
                'user' => ['name' => 'Amit Sharma', 'email' => 'amit.auto@example.com'],
                'business' => ['name' => 'Desi Auto Repair', 'category' => 'Other', 'city' => 'Edison'],
                'ad' => ['title' => 'Full Service Tune-up Special', 'image' => 'storage/localads/auto_1.png']
            ],
            [
                'user' => ['name' => 'Priya Das', 'email' => 'priya.yoga@example.com'],
                'business' => ['name' => 'Yoga with Priya', 'category' => 'Other', 'city' => 'Jersey City'],
                'ad' => ['title' => 'First Class Free for New Students', 'image' => 'storage/localads/yoga_1.png']
            ],
            [
                'user' => ['name' => 'Vikram Seth', 'email' => 'vikram.legal@example.com'],
                'business' => ['name' => 'Elite Legal Services', 'category' => 'Legal & Financial', 'city' => 'Princeton'],
                'ad' => ['title' => 'Free Initial Legal Consultation', 'image' => 'storage/localads/legal_1.png']
            ],
            [
                'user' => ['name' => 'Sanjay Gupta', 'email' => 'sanjay.land@example.com'],
                'business' => ['name' => 'Green Leaf Landscaping', 'category' => 'Home Services', 'city' => 'Edison'],
                'ad' => ['title' => 'Spring Garden Clean-up - 15% Off', 'image' => 'storage/localads/landscape_1.png']
            ],
            [
                'user' => ['name' => 'Dr. Anjali Rao', 'email' => 'anjali.dent@example.com'],
                'business' => ['name' => 'Shine Dental Clinic', 'category' => 'Healthcare', 'city' => 'Jersey City'],
                'ad' => ['title' => 'New Patient Exam & X-Rays $99', 'image' => 'storage/localads/health_1.png']
            ],
            [
                'user' => ['name' => 'Meera Nair', 'email' => 'meera.edu@example.com'],
                'business' => ['name' => 'Bright Spark Tutoring', 'category' => 'Education & Tutoring', 'city' => 'Edison'],
                'ad' => ['title' => 'Expert Math & Science Tutoring K-12', 'image' => 'storage/localads/edu_1.png']
            ],
            [
                'user' => ['name' => 'Rajesh Khanna', 'email' => 'rajesh.travel@example.com'],
                'business' => ['name' => 'Spice Route Travels', 'category' => 'Travel & Immigration', 'city' => 'Jersey City'],
                'ad' => ['title' => 'Book Your Dream Vacation - Best Rates', 'image' => 'storage/localads/travel_1.png']
            ],
            [
                'user' => ['name' => 'Kiran Shah', 'email' => 'kiran.events@example.com'],
                'business' => ['name' => 'Vibrant Events & Decor', 'category' => 'Events & Entertainment', 'city' => 'Edison'],
                'ad' => ['title' => 'Premium Event Planning & Decor', 'image' => 'storage/localads/event_1.png']
            ],
            [
                'user' => ['name' => 'Arjun Varma', 'email' => 'arjun.photo@example.com'],
                'business' => ['name' => 'Modern Photography', 'category' => 'Photography', 'city' => 'Princeton'],
                'ad' => ['title' => 'Wedding & Event Photography Packages', 'image' => 'storage/localads/photo_1.png']
            ],
            [
                'user' => ['name' => 'Sophie Thomas', 'email' => 'sophie.bake@example.com'],
                'business' => ['name' => 'Fresh Bake Patisserie', 'category' => 'Bakery', 'city' => 'Jersey City'],
                'ad' => ['title' => 'Authentic French Pastries & Cakes', 'image' => 'storage/localads/bakery_1.png']
            ],
        ];

        foreach ($businessData as $data) {
            $user = User::create([
                'name' => $data['user']['name'],
                'email' => $data['user']['email'],
                'password' => Hash::make('Test123*'),
            ]);

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

            LocalAd::create([
                'business_account_id' => $business->id,
                'title' => $data['ad']['title'],
                'description' => "Professional services from " . $data['business']['name'] . ". We pride ourselves on quality and customer satisfaction. This is a real-business style advertisement for demonstration.",
                'category' => $data['business']['category'],
                'tags' => [$data['business']['category'], 'Service', 'Professional'],
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
