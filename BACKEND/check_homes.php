<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
echo 'Homes count: ' . \App\Models\BuySellHome::count() . "\n";
$activeCount = \App\Models\BuySellHome::where('status', 'active')->count();
echo 'Active Homes count: ' . $activeCount . "\n";
