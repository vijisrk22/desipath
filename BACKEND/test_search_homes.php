<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$zipcode = '08807';
$radius = 70; // Miles

echo "Searching for center point for zip: {$zipcode}...\n";
$centerPoint = DB::table('usa_zipcodes')->where('zip', $zipcode)->first();

if ($centerPoint) {
    echo "Center point found: City: {$centerPoint->city}, Lat: {$centerPoint->lat}, Lng: {$centerPoint->lng}\n\n";
    $lat = $centerPoint->lat;
    $lng = $centerPoint->lng;
    
    // Test BuySellHome Search Query
    echo "=== BUYSELLHOMES SEARCH ===\n";
    $latRange = $radius / 69;
    $lngRange = $radius / (69 * cos(deg2rad($lat)));
    
    $query = DB::table('buysellhomes')
        ->where('status', 'active')
        ->where(function ($q) use ($lat, $latRange, $lng, $lngRange, $zipcode) {
            $q->where('location_zipcode', $zipcode)
              ->orWhere(function ($subQ) use ($lat, $latRange, $lng, $lngRange) {
                  $subQ->whereNotNull('latitude')
                       ->whereNotNull('longitude')
                       ->whereBetween('latitude', [$lat - $latRange, $lat + $latRange])
                       ->whereBetween('longitude', [$lng - $lngRange, $lng + $lngRange]);
              });
        });

    $query->select('*')
        ->selectRaw("IFNULL((3959 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))), 9999) AS distance", [$lat, $lng, $lat])
        ->havingRaw("distance <= ? OR location_zipcode = ?", [$radius, $zipcode]);
        
    $query->orderByRaw("CASE WHEN location_zipcode = ? THEN 0 ELSE 1 END ASC", [$zipcode])
          ->orderBy('distance', 'asc');
          
    $results = $query->get();
    echo "Total BuySellHomes found: " . count($results) . "\n";
    foreach ($results as $home) {
        echo "ID: {$home->id}, City: {$home->location_city}, Zip: {$home->location_zipcode}, Dist: " . round($home->distance, 2) . " miles\n";
    }
    
    // Test RentalHome Search Query
    echo "\n=== RENTALHOMES SEARCH ===\n";
    $queryRH = DB::table('RentalHomes')
        ->where('status', 'active')
        ->where(function ($q) use ($lat, $latRange, $lng, $lngRange, $zipcode) {
            $q->where('location_zipcode', $zipcode)
              ->orWhere(function ($subQ) use ($lat, $latRange, $lng, $lngRange) {
                  $subQ->whereNotNull('latitude')
                       ->whereNotNull('longitude')
                       ->whereBetween('latitude', [$lat - $latRange, $lat + $latRange])
                       ->whereBetween('longitude', [$lng - $lngRange, $lng + $lngRange]);
              });
        });

    $queryRH->select('*')
        ->selectRaw("IFNULL((3959 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))), 9999) AS distance", [$lat, $lng, $lat])
        ->havingRaw("distance <= ? OR location_zipcode = ?", [$radius, $zipcode]);
        
    $queryRH->orderByRaw("CASE WHEN location_zipcode = ? THEN 0 ELSE 1 END ASC", [$zipcode])
          ->orderBy('distance', 'asc');
          
    $resultsRH = $queryRH->get();
    echo "Total RentalHomes found: " . count($resultsRH) . "\n";
    foreach ($resultsRH as $home) {
        echo "ID: {$home->id}, City: {$home->location_city}, Zip: {$home->location_zipcode}, Dist: " . round($home->distance, 2) . " miles\n";
    }

} else {
    echo "Center point not found for Zip: {$zipcode}\n";
}
