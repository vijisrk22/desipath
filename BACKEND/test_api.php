<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$request = Request::create('/api/homes/search', 'POST', [
    'city' => '',
    'state' => '',
    'zipcode' => '08540',
    'priceMin' => 0,
    'priceMax' => 5000000
]);

$controller = new \App\Http\Controllers\HomesController();
$response = $controller->search($request);
echo $response->getContent();
