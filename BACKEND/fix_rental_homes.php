<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\RentalHome;

$cities = [
    ['city' => 'San Jose', 'state' => 'California'],
    ['city' => 'Austin', 'state' => 'Texas'],
    ['city' => 'Seattle', 'state' => 'Washington'],
    ['city' => 'Chicago', 'state' => 'Illinois'],
    ['city' => 'New York', 'state' => 'New York'],
];

$images = [
    ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600&auto=format&fit=crop"],
    ["https://images.unsplash.com/photo-1560185016-01d0092c69d4?q=80&w=600&auto=format&fit=crop"],
    ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop"],
    ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop"],
    ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop"]
];

$homes = RentalHome::all();

foreach ($homes as $index => $home) {
    $cityState = $cities[$index % count($cities)];
    $img = $images[$index % count($images)];
    
    $home->location_city = $cityState['city'];
    $home->location_state = $cityState['state'];
    $home->images = $img;
    $home->save();
}

echo "Updated " . count($homes) . " rental homes.\n";
