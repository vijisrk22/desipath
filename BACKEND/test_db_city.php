<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$city = 'Princeton';
$zip = DB::table('usa_zipcodes')->where('city', 'like', '%' . $city . '%')->first();
if ($zip) {
    echo "Found $city: lat=" . $zip->lat . ", lng=" . $zip->lng . ", state=" . $zip->state_name . ", zip=" . $zip->zip . "\n";
} else {
    echo "$city not found\n";
}
