<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$userIds = DB::table('users')->pluck('id')->toArray();
$users = DB::table('users')->get()->keyBy('id');

if (empty($userIds)) {
    echo "No users found in database!\n";
    exit;
}

$updatedCount = 0;

// Update BuySellCars (seller_id, seller_name, owner_name)
$cars = DB::table('BuySellCars')->get();
foreach ($cars as $car) {
    $randomUserId = $userIds[array_rand($userIds)];
    $userName = $users[$randomUserId]->name;
    DB::table('BuySellCars')->where('id', $car->id)->update([
        'seller_id' => $randomUserId,
        'seller_name' => $userName,
        'owner_name' => $userName
    ]);
    $updatedCount++;
}
echo "Updated BuySellCars\n";

// Update RoomMates (poster_id, poster_name)
$rooms = DB::table('RoomMates')->get();
foreach ($rooms as $room) {
    $randomUserId = $userIds[array_rand($userIds)];
    $userName = $users[$randomUserId]->name;
    DB::table('RoomMates')->where('id', $room->id)->update([
        'poster_id' => $randomUserId,
        'poster_name' => $userName
    ]);
    $updatedCount++;
}
echo "Updated RoomMates\n";

// Ensure RentalHomes have owner_name matched just in case
$rentals = DB::table('RentalHomes')->get();
foreach ($rentals as $rental) {
    $randomUserId = $userIds[array_rand($userIds)];
    $userName = $users[$randomUserId]->name;
    DB::table('RentalHomes')->where('id', $rental->id)->update([
        'owner_id' => $randomUserId,
        'owner_name' => $userName
    ]);
    $updatedCount++;
}
echo "Updated RentalHomes\n";

echo "Successfully updated $updatedCount total postings across all tables with valid owners.\n";
