<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$types = DB::table('RentalHomes')->distinct()->pluck('property_type')->toArray();
print_r($types);
