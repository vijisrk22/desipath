<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$zips = DB::table('usa_zipcodes')->where('zip', '08540')->get();
foreach ($zips as $zip) {
    echo "Found 08540: lat=" . $zip->lat . ", lng=" . $zip->lng . ", city=" . $zip->city . ", state=" . $zip->state_name . "\n";
}
