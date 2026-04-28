<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\BuySellCar;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Controllers\CarController;

$request = new Request([
    'city' => 'Paterson',
    'state' => 'New Jersey',
    'zipcode' => '07522',
    'carMake' => '',
    'carModel' => '',
    'priceMin' => 0,
    'priceMax' => 100000
]);

$controller = new CarController();
$response = $controller->search($request);
echo "Response Status: " . $response->getStatusCode() . "\n";
echo "Body: " . $response->getContent() . "\n";
