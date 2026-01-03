<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegularUserController;
use App\Http\Controllers\BusinessUserController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\SignupController;
use App\Http\Controllers\RoomMatesController;

// Serve storage files FIRST (workaround for Windows symlink issues)
// Match specific storage subdirectories
Route::get('/storage/{directory}/{filename}', function ($directory, $filename) {
    $filePath = storage_path('app/public/' . $directory . '/' . $filename);
    
    if (!file_exists($filePath) || !is_file($filePath)) {
        abort(404, 'File not found');
    }
    
    // Get MIME type
    $mimeType = mime_content_type($filePath);
    if (!$mimeType) {
        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        $mimeTypes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
        ];
        $mimeType = $mimeTypes[strtolower($extension)] ?? 'application/octet-stream';
    }
    
    return response()->make(file_get_contents($filePath), 200, [
        'Content-Type' => $mimeType,
        'Content-Length' => filesize($filePath),
        'Cache-Control' => 'public, max-age=31536000',
    ]);
})->where(['directory' => '[a-zA-Z0-9_-]+', 'filename' => '[a-zA-Z0-9._-]+']);

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('/signup', [SignupController::class, 'showSignupPage']);


Route::get('/dashboard', function () {
    if (auth()->user()->isBusinessUser()) {
        return redirect('/business-dashboard');
    }
    return redirect('/user-dashboard');
})->middleware('auth');

Route::get('/user-dashboard', [RegularUserController::class, 'index'])->middleware('auth');
Route::get('/business-dashboard', [BusinessUserController::class, 'index'])->middleware('auth');

// Route::prefix('api')->middleware('api')->group(function () {
// });

Route::get('/roommates', [RoomMatesController::class, 'start'])->name('room-share');
