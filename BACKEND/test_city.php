<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$centerPoint = \DB::table('usa_zipcodes')
    ->where('city', 'like', '%Princeton%')
    ->first();
echo "First Princeton: " . $centerPoint->city . ", state: " . $centerPoint->state_id . ", lat: " . $centerPoint->lat . "\n";
