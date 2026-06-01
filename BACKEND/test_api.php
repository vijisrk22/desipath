<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$request = Illuminate\Http\Request::create('/api/buy-sell-items', 'GET', [
    'city' => 'Edison',
    'zipcode' => '08817',
    'min_price' => '0',
    'max_price' => '10000',
    'category' => 'All Categories'
]);

$controller = new App\Http\Controllers\BuySellItemController();
$response = $controller->index($request);

echo $response->getContent();
