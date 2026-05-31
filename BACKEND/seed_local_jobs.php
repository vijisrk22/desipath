<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

$userIds = DB::table('users')->pluck('id')->toArray();
if (empty($userIds)) {
    die("No users found in database.\n");
}

$categories = [
    "Nanny / Babysitter",
    "Elder Care",
    "Cook / Chef",
    "Grocery Store Worker",
    "House Cleaning",
    "Driver",
    "Handyman",
    "Other"
];

$locations = [
    ['city' => 'Edison', 'state' => 'NJ', 'zipcode' => '08820'],
    ['city' => 'Jersey City', 'state' => 'NJ', 'zipcode' => '07302'],
    ['city' => 'Fremont', 'state' => 'CA', 'zipcode' => '94538'],
    ['city' => 'Sunnyvale', 'state' => 'CA', 'zipcode' => '94086'],
    ['city' => 'Frisco', 'state' => 'TX', 'zipcode' => '75034'],
    ['city' => 'Irving', 'state' => 'TX', 'zipcode' => '75039'],
    ['city' => 'Alpharetta', 'state' => 'GA', 'zipcode' => '30005'],
    ['city' => 'Naperville', 'state' => 'IL', 'zipcode' => '60540'],
    ['city' => 'Bellevue', 'state' => 'WA', 'zipcode' => '98004'],
    ['city' => 'Ashburn', 'state' => 'VA', 'zipcode' => '20147'],
];

$titles = [
    "Nanny / Babysitter" => ["Experienced Nanny Needed", "Looking for a Weekend Babysitter", "After-school Nanny required", "Full-time Indian Nanny", "Live-in Nanny needed"],
    "Elder Care" => ["Compassionate Caregiver", "Elderly Care Assistant", "Help needed for elderly parent", "Part-time Elder Care", "Live-in Caregiver for Seniors"],
    "Cook / Chef" => ["Indian Cook Needed", "Looking for a Vegetarian Chef", "Part-time Cook for Family", "Weekend Meal Prep Help", "Authentic South Indian Cook"],
    "Grocery Store Worker" => ["Cashier for Indian Grocery", "Store Helper Needed", "Stock Clerk at Desi Mart", "Customer Service Assistant", "Full-time Grocery Staff"],
    "House Cleaning" => ["Bi-weekly House Cleaning", "Deep Cleaning Services needed", "Looking for reliable maid", "Part-time Cleaner", "Weekend Housekeeper"],
    "Driver" => ["School Drop-off Driver", "Looking for Uber/Lyft alternatives", "Driver for Senior Citizen", "Airport Drop-off help", "Weekend Driver"],
    "Handyman" => ["Plumbing Help Needed", "Looking for a Carpenter", "General Handyman for Repairs", "Electrician needed for small job", "Furniture Assembly Help"],
    "Other" => ["Lawn Mowing Help", "Snow Shoveling assistance", "Help with moving", "Dog Walker needed", "Tutor for High School Math"]
];

$pay_rates = ["$15/hr", "$20/hr", "$25/hr", "Negotiable", "$50/day", "$100/week", "$300/week", "Depends on experience"];

$jobsToInsert = [];
for ($i = 0; $i < 50; $i++) {
    $category = $categories[array_rand($categories)];
    $titleList = $titles[$category];
    $title = $titleList[array_rand($titleList)];
    $loc = $locations[array_rand($locations)];
    $pay = $pay_rates[array_rand($pay_rates)];
    $userId = $userIds[array_rand($userIds)];
    
    // Add some random descriptions
    $desc = "We are looking for a reliable and experienced person for this role. The schedule is somewhat flexible. \n\nMust have prior experience. References required. \n\nPlease message me directly on DesiPath for more details.";
    
    $jobsToInsert[] = [
        'user_id' => $userId,
        'title' => $title,
        'category' => $category,
        'description' => $desc,
        'city' => $loc['city'],
        'state' => $loc['state'],
        'zipcode' => $loc['zipcode'],
        'pay_rate' => $pay,
        'status' => 'active',
        'created_at' => Carbon::now()->subDays(rand(0, 30))->subHours(rand(0, 24)),
        'updated_at' => Carbon::now()
    ];
}

DB::table('local_jobs')->insert($jobsToInsert);

echo "Successfully seeded 50 realistic local jobs.\n";
