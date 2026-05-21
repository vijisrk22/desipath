<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

$userIds = DB::table('users')->pluck('id')->toArray();
if (empty($userIds)) {
    echo "No users found in database!\n";
    exit;
}

// Get all tables
$tables = array_map('current', DB::select('SHOW TABLES'));

$updatedCount = 0;

foreach ($tables as $table) {
    if (Schema::hasColumn($table, 'owner_id')) {
        $records = DB::table($table)->get();
        foreach ($records as $record) {
            $randomUserId = $userIds[array_rand($userIds)];
            
            $updateData = ['owner_id' => $randomUserId];
            
            // If the table also caches owner_name, update it too
            if (Schema::hasColumn($table, 'owner_name')) {
                $user = DB::table('users')->where('id', $randomUserId)->first();
                if ($user) {
                    $updateData['owner_name'] = $user->name;
                }
            }
            
            DB::table($table)->where('id', $record->id)->update($updateData);
            $updatedCount++;
        }
        echo "Updated $table\n";
    }
}

echo "Successfully updated $updatedCount total postings across all tables with valid owners.\n";
