<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$homes = DB::table('buysellhomes')->where('location_city', 'like', '%Princeton%')->get();
foreach ($homes as $home) {
    echo json_encode($home) . "\n";
}
