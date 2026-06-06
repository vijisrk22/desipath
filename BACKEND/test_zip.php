<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$zips = DB::table('usa_zipcodes')->where('zip', 'like', '%0854%')->get();
foreach ($zips as $zip) {
    echo "Found: " . $zip->zip . ", city: " . $zip->city . "\n";
}
