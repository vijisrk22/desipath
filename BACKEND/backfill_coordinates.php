<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

function cleanString($str) {
    return trim(preg_replace('/\s+/', ' ', $str));
}

echo "Starting backfill of coordinates...\n\n";

// 1. Backfill buysellhomes
$buysellhomes = DB::table('buysellhomes')->get();
$bsUpdated = 0;
$bsTotal = count($buysellhomes);
$bsFailed = 0;

foreach ($buysellhomes as $home) {
    $zip = cleanString($home->location_zipcode);
    $city = cleanString($home->location_city);
    $state = cleanString($home->location_state);
    
    $coords = null;
    
    // Attempt 1: match by Zipcode
    if (!empty($zip) && $zip !== '00000' && $zip !== '0') {
        $coords = DB::table('usa_zipcodes')->where('zip', $zip)->first();
    }
    
    // Attempt 2: match by City and State
    if (!$coords && !empty($city)) {
        $query = DB::table('usa_zipcodes')->where('city', 'like', $city);
        if (!empty($state)) {
            $query->where(function($q) use ($state) {
                $q->where('state_name', 'like', $state)
                  ->orWhere('state_id', 'like', $state);
            });
        }
        $coords = $query->first();
    }
    
    // If coordinates found, update
    if ($coords) {
        $updateData = [
            'latitude' => $coords->lat,
            'longitude' => $coords->lng
        ];
        
        // If the zip code was invalid or missing, update it too
        if (empty($zip) || $zip === '00000' || $zip === '0') {
            $updateData['location_zipcode'] = $coords->zip;
        }
        
        DB::table('buysellhomes')->where('id', $home->id)->update($updateData);
        $bsUpdated++;
    } else {
        $bsFailed++;
        echo "No coordinates found for BuySellHome ID {$home->id}: City: '{$city}', State: '{$state}', Zip: '{$zip}'\n";
    }
}

echo "\nBuySellHomes stats: Total: {$bsTotal}, Updated: {$bsUpdated}, Failed: {$bsFailed}\n\n";

// 2. Backfill RentalHomes
$rentalHomes = DB::table('RentalHomes')->get();
$rhUpdated = 0;
$rhTotal = count($rentalHomes);
$rhFailed = 0;

foreach ($rentalHomes as $home) {
    $zip = cleanString($home->location_zipcode);
    $city = cleanString($home->location_city);
    $state = cleanString($home->location_state);
    
    $coords = null;
    
    // Attempt 1: match by Zipcode
    if (!empty($zip) && $zip !== '00000' && $zip !== '0') {
        $coords = DB::table('usa_zipcodes')->where('zip', $zip)->first();
    }
    
    // Attempt 2: match by City and State
    if (!$coords && !empty($city)) {
        $query = DB::table('usa_zipcodes')->where('city', 'like', $city);
        if (!empty($state)) {
            $query->where(function($q) use ($state) {
                $q->where('state_name', 'like', $state)
                  ->orWhere('state_id', 'like', $state);
            });
        }
        $coords = $query->first();
    }
    
    // If coordinates found, update
    if ($coords) {
        $updateData = [
            'latitude' => $coords->lat,
            'longitude' => $coords->lng
        ];
        
        // If the zip code was invalid or missing, update it too
        if (empty($zip) || $zip === '00000' || $zip === '0') {
            $updateData['location_zipcode'] = $coords->zip;
        }
        
        DB::table('RentalHomes')->where('id', $home->id)->update($updateData);
        $rhUpdated++;
    } else {
        $rhFailed++;
        echo "No coordinates found for RentalHome ID {$home->id}: City: '{$city}', State: '{$state}', Zip: '{$zip}'\n";
    }
}

echo "\nRentalHomes stats: Total: {$rhTotal}, Updated: {$rhUpdated}, Failed: {$rhFailed}\n";
echo "Backfill finished.\n";
