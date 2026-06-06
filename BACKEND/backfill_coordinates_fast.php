<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Starting fast SQL-based coordinate backfill...\n\n";

try {
    // --- buysellhomes ---
    // 1. Join on zip code
    $affectedZipBS = DB::update("
        UPDATE buysellhomes h
        JOIN usa_zipcodes z ON TRIM(h.location_zipcode) = z.zip
        SET h.latitude = z.lat, h.longitude = z.lng
    ");
    echo "buysellhomes (match by ZIP): Affected rows: {$affectedZipBS}\n";

    // 2. Join on City & State (for invalid/empty ZIPs)
    $affectedCityBS = DB::update("
        UPDATE buysellhomes h
        JOIN usa_zipcodes z ON TRIM(h.location_city) = z.city AND (TRIM(h.location_state) = z.state_name OR TRIM(h.location_state) = z.state_id)
        SET h.latitude = z.lat, h.longitude = z.lng, h.location_zipcode = z.zip
        WHERE h.location_zipcode = '00000' OR h.location_zipcode IS NULL OR TRIM(h.location_zipcode) = ''
    ");
    echo "buysellhomes (match by City/State for missing ZIP): Affected rows: {$affectedCityBS}\n";

    // --- RentalHomes ---
    // 1. Join on zip code
    $affectedZipRH = DB::update("
        UPDATE RentalHomes h
        JOIN usa_zipcodes z ON TRIM(h.location_zipcode) = z.zip
        SET h.latitude = z.lat, h.longitude = z.lng
    ");
    echo "RentalHomes (match by ZIP): Affected rows: {$affectedZipRH}\n";

    // 2. Join on City & State (for invalid/empty ZIPs)
    $affectedCityRH = DB::update("
        UPDATE RentalHomes h
        JOIN usa_zipcodes z ON TRIM(h.location_city) = z.city AND (TRIM(h.location_state) = z.state_name OR TRIM(h.location_state) = z.state_id)
        SET h.latitude = z.lat, h.longitude = z.lng, h.location_zipcode = z.zip
        WHERE h.location_zipcode = '00000' OR h.location_zipcode IS NULL OR TRIM(h.location_zipcode) = ''
    ");
    echo "RentalHomes (match by City/State for missing ZIP): Affected rows: {$affectedCityRH}\n";

} catch (\Exception $e) {
    echo "ERROR during backfill: " . $e->getMessage() . "\n";
}

echo "\nFast backfill finished.\n";
