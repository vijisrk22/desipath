<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$lat = 42.456490; // Princeton MA
$lng = -71.881;
$radius = 70;

$homes = DB::table('buysellhomes')
    ->select('*')
    ->selectRaw("(3959 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance", [$lat, $lng, $lat])
    ->having('distance', '<=', 1000)
    ->get();

foreach ($homes as $home) {
    echo "ID: " . $home->id . ", city: " . $home->location_city . ", dist: " . $home->distance . "\n";
}
