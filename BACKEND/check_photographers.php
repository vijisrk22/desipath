<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
echo 'Photographer count: ' . \App\Models\Photographer::count() . "\n";
try {
    $activeCount = \App\Models\Photographer::where('status', 'active')->count();
    echo 'Active count: ' . $activeCount . "\n";
} catch (\Exception $e) {
    echo "Error querying status: " . $e->getMessage() . "\n";
}
