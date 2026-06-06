<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$homes = DB::table('buysellhomes')->get();
foreach ($homes as $home) {
    echo "ID: " . $home->id . ", city: " . $home->location_city . ", zip: " . $home->location_zipcode . ", lat: " . $home->latitude . ", lng: " . $home->longitude . "\n";
}
