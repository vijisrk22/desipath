<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\FinancialAdvisor;

FinancialAdvisor::query()->update(['cover_image' => '/img/advisors/cover.png']);
$advisors = FinancialAdvisor::all();
foreach($advisors as $idx => $a) {
    $a->advisor_profile_image = ($idx % 2 == 0) ? '/img/advisors/male.png' : '/img/advisors/female.png';
    $a->save();
}
echo "Images updated successfully!\n";
