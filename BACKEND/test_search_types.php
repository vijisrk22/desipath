<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== TESTING BUYSELLHOMES PROPERTY TYPES MAPPING ===\n";
$houseTypeInput = ['Condominium', 'Single Family'];

// Simulate backend mapping logic
$mappedHouseTypes = [];
foreach ($houseTypeInput as $type) {
    if (strcasecmp($type, 'Condominium') === 0 || strcasecmp($type, 'Condominum') === 0) {
        $mappedHouseTypes[] = 'Condominum';
    } elseif (strcasecmp($type, 'Single Family') === 0 || strcasecmp($type, 'Single family') === 0) {
        $mappedHouseTypes[] = 'Single family';
    } elseif (strcasecmp($type, 'Townhouse') === 0 || strcasecmp($type, 'Town home') === 0) {
        $mappedHouseTypes[] = 'Town home';
    } else {
        $mappedHouseTypes[] = $type;
    }
}
echo "Mapped Input: " . implode(', ', $mappedHouseTypes) . "\n";

$query = DB::table('buysellhomes')->where('status', 'active');
$query->where(function ($q) use ($mappedHouseTypes) {
    foreach ($mappedHouseTypes as $type) {
        $q->orWhere('home_type', 'like', '%' . $type . '%');
    }
});

$results = $query->get();
echo "Found properties count: " . count($results) . "\n";
foreach ($results->take(5) as $home) {
    echo " - ID: {$home->id}, Type in DB: {$home->home_type}\n";
}


echo "\n=== TESTING RENTALHOMES PROPERTY TYPES MAPPING ===\n";
$rentalHomeTypeInput = ['Single Family', 'Basement'];

// Simulate backend mapping logic
$mappedRentalTypes = [];
foreach ($rentalHomeTypeInput as $type) {
    if (strcasecmp($type, 'Condominium') === 0 || strcasecmp($type, 'Condo') === 0) {
        $mappedRentalTypes[] = 'Condo';
    } elseif (strcasecmp($type, 'Single Family') === 0 || strcasecmp($type, 'Single family Home') === 0) {
        $mappedRentalTypes[] = 'Single family Home';
    } elseif (strcasecmp($type, 'Basement') === 0 || strcasecmp($type, 'Basement Apartment') === 0) {
        $mappedRentalTypes[] = 'Basement Apartment';
    } elseif (strcasecmp($type, 'Apartment') === 0) {
        $mappedRentalTypes[] = 'Apartment';
    } else {
        $mappedRentalTypes[] = $type;
    }
}
echo "Mapped Input: " . implode(', ', $mappedRentalTypes) . "\n";

$queryRH = DB::table('RentalHomes')->where('status', 'active');
$queryRH->whereIn('property_type', $mappedRentalTypes);

$resultsRH = $queryRH->get();
echo "Found properties count: " . count($resultsRH) . "\n";
foreach ($resultsRH as $home) {
    echo " - ID: {$home->id}, Type in DB: {$home->property_type}\n";
}
