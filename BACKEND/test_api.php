<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Http\Controllers\ForumController;
use Illuminate\Http\Request;

$controller = new ForumController();
$request = new Request();
$response = $controller->index($request);

echo "Status Code: " . $response->getStatusCode() . "\n";
echo "Response Data:\n";
print_r($response->getData(true));
