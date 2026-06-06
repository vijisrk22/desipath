<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\RentalHome;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

echo "Starting CA and NJ Rental Homes Seeding...\n\n";

$faker = Faker::create();

// 1. Ensure target directory exists
$targetDir = storage_path('app/public/rentalhomes');
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0755, true);
}

// 2. Scan and copy images from source
$sourceDir = 'F:\\Desipath-code\\Homes';
$images = [];

if (file_exists($sourceDir) && is_dir($sourceDir)) {
    $files = scandir($sourceDir);
    foreach ($files as $file) {
        $filePath = $sourceDir . DIRECTORY_SEPARATOR . $file;
        if (is_file($filePath)) {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($ext, ['jpg', 'jpeg', 'png'])) {
                // Generate a unique name for target to avoid collisions
                $uniqueName = uniqid() . '_' . $file;
                $targetPath = $targetDir . DIRECTORY_SEPARATOR . $uniqueName;
                
                if (copy($filePath, $targetPath)) {
                    $images[] = 'storage/rentalhomes/' . $uniqueName;
                }
            }
        }
    }
}

if (count($images) === 0) {
    echo "Warning: No images copied from {$sourceDir}. Using fallback placeholders.\n";
    $images[] = 'https://picsum.photos/1280/720?random=1';
    $images[] = 'https://picsum.photos/1280/720?random=2';
} else {
    echo "Successfully copied " . count($images) . " images to public storage.\n";
}

// 3. Get or create a poster user
$user = User::first();
if (!$user) {
    $user = User::create([
        'name' => 'System Admin',
        'email' => 'admin@desipath.com',
        'password' => Hash::make('password'),
    ]);
}
$ownerId = $user->id;
$ownerName = $user->name;

// 4. Retrieve CA zip codes
$caZips = DB::table('usa_zipcodes')
    ->where('state_id', 'CA')
    ->whereNotNull('lat')
    ->whereNotNull('lng')
    ->inRandomOrder()
    ->limit(100)
    ->get();

// 5. Retrieve NJ zip codes
$njZips = DB::table('usa_zipcodes')
    ->where('state_id', 'NJ')
    ->whereNotNull('lat')
    ->whereNotNull('lng')
    ->inRandomOrder()
    ->limit(100)
    ->get();

if (count($caZips) === 0 || count($njZips) === 0) {
    echo "ERROR: Could not retrieve CA or NJ zip codes from usa_zipcodes table.\n";
    exit(1);
}

$amenityPool = [
    'Gym', 'Swimming Pool', 'Club House', 'Walk-In Closets', 
    'Window Coverings', 'Balcony', 'Patio', 'Hardwood Floors', 
    'Microwave', 'Granite Counter', 'Washer Dryer', 'Air conditioning', 'Heating'
];

$descriptions = [
    "Stunning home located in a quiet and friendly neighborhood. Featuring spacious living areas, a fully equipped modern kitchen, and plenty of natural light. Close to top-rated schools, parks, and shopping centers. Ideal for families and professionals alike.",
    "Beautiful and cozy property with an open-concept layout. Enjoy cooking in the chef's kitchen with granite countertops, or relax in the private backyard patio. Convenient access to public transit, highways, dining, and local amenities.",
    "Charming residence offering comfortable living and classic style. This home features hardwood floors, upgraded appliances, generous closet space, and a dedicated parking space. Located just minutes away from downtown area.",
    "Modern apartment with premium finishes and top-tier amenities. Includes access to a state-of-the-art fitness center, swimming pool, and community lounge. Secure building with on-site management and secure parking.",
    "Spacious and well-maintained basement apartment in a prime location. Features private entrance, separate laundry facilities, high ceilings, and modern fixtures. Perfect for students or single professionals seeking comfort and value."
];

// Helper to generate a posting
$createPosting = function ($zipRecord, $stateName) use ($faker, $images, $ownerId, $ownerName, $amenityPool, $descriptions) {
    $propType = $faker->randomElement(['Single family Home', 'Apartment', 'Condo', 'Basement Apartment']);
    $bhk = $faker->randomElement(['1 Bed 1 Bath', '2 Bed 2 Bath', '2 Bed 1 Bath', '3 Bed 3 Bath', '3 Bed 2 Bath', '4 Bed 4 Bath', '4 Bed 3 Bath', '4 Bed 2 Bath']);
    $parts = explode(' ', $bhk);
    $bedrooms = (int)$parts[0];
    $bathrooms = (int)$parts[2];
    
    // Choose 1 to 4 random images
    $propImages = [];
    $numImages = min(count($images), rand(2, 5));
    $shuffledImages = $images;
    shuffle($shuffledImages);
    for ($i = 0; $i < $numImages; $i++) {
        $propImages[] = $shuffledImages[$i];
    }
    
    // Choose random amenities
    $numAmenities = rand(3, 8);
    $propAmenities = $faker->randomElements($amenityPool, $numAmenities);
    
    // Base rent pricing based on bedrooms
    $baseRent = $bedrooms * 1000 + rand(200, 1500);
    
    $data = [
        'property_type' => $propType,
        'available_from' => $faker->dateTimeBetween('-1 month', '+2 months')->format('Y-m-d'),
        'area' => rand(550, 2800),
        'deposit_rent' => $baseRent,
        'bhk' => $bhk,
        'address' => $faker->streetAddress,
        'community_name' => $faker->company . " Residences",
        'amenities' => $propAmenities, // Will be cast by model mutator
        'pets' => $faker->boolean(70),
        'images' => $propImages, // Cast to JSON automatically by model
        'accommodates' => $bedrooms * 2,
        'location_state' => $stateName,
        'location_city' => $zipRecord->city,
        'location_zipcode' => $zipRecord->zip,
        'latitude' => $zipRecord->lat,
        'longitude' => $zipRecord->lng,
        'smoking' => $faker->randomElement(['Ok', 'Not okay']),
        'owner_id' => $ownerId,
        'owner_name' => $ownerName,
        'description' => $faker->randomElement($descriptions),
        'contact_no' => $faker->numerify('###-###-####'),
        'status' => 'active',
        'created_at' => now(),
        'updated_at' => now(),
    ];
    
    RentalHome::create($data);
};

// 6. Generate 50 CA postings
echo "Generating 50 CA postings...\n";
for ($i = 0; $i < 50; $i++) {
    $zipRecord = $caZips[$i % count($caZips)];
    $createPosting($zipRecord, 'California');
}

// 7. Generate 50 NJ postings
echo "Generating 50 NJ postings...\n";
for ($i = 0; $i < 50; $i++) {
    $zipRecord = $njZips[$i % count($njZips)];
    $createPosting($zipRecord, 'New Jersey');
}

echo "\nSeeding Completed successfully! Added 100 rental postings.\n";
