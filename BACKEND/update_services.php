<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\FinancialAdvisor;

$categoriesList = [
    "401k", "Annuity", "Health Insurance", "Life Insurance", 
    "Travel Insurance", "Auto Insurance", "Will & Trust", 
    "College Savings", "US-Tax", "India-Tax"
];

$advisors = FinancialAdvisor::all();
foreach($advisors as $a) {
    // Pick 3 to 5 random categories
    shuffle($categoriesList);
    $a->services = array_slice($categoriesList, 0, rand(3, 5));
    $a->save();
}
echo "Services updated successfully!\n";
