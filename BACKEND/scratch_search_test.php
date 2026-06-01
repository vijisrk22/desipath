<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\BuySellCar;
use Illuminate\Support\Facades\DB;

$city = 'Paterson';
$state = 'New Jersey';
$zipcode = '07522';
$radius = 70;

$centerPoint = DB::table('usa_zipcodes')->where('zip', $zipcode)->first();
if (!$centerPoint && $city) {
    $centerPoint = DB::table('usa_zipcodes')
        ->where('city', 'like', '%' . $city . '%')
        ->first();
}

if ($centerPoint) {
    echo "Center Point Found: " . $centerPoint->city . " (" . $centerPoint->lat . ", " . $centerPoint->lng . ")\n";
    
    $lat = $centerPoint->lat;
    $lng = $centerPoint->lng;
    
    $query = BuySellCar::query();
    $query->select('*')
        ->selectRaw("(3959 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance", [$lat, $lng, $lat])
        ->having('distance', '<=', $radius);
    
    $results = $query->get();
    echo "Results Count: " . $results->count() . "\n";
    foreach ($results as $res) {
        echo " - " . $res->make . " " . $res->model . " at " . $res->location_city . " (Dist: " . $res->distance . ")\n";
    }
} else {
    echo "Center Point NOT Found\n";
}
