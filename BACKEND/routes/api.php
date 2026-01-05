<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CarController;
use App\Http\Controllers\HomesController;
use App\Http\Controllers\RentalHomesController;
use App\Http\Controllers\RoomMatesController;
use App\Http\Controllers\TrainingAdsController;
use App\Http\Controllers\AstrologyAdsController;
use App\Http\Controllers\ClassesforKidsAdsController;
use App\Http\Controllers\TravelCompanionsController;
use App\Models\BuySellCar;
use App\Models\BuySellHome;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\Api\Auth\GoogleAuthController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\EventsController;

use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;



Route::options('{any}', function () {
    return response()->json([], 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
})->where('any', '.*');

Route::post('/auth/google', [GoogleAuthController::class, 'login']);
Route::post('/auth/googlecheck', [GoogleAuthController::class, 'googlecheck']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);

Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Logged out successfully']);
});

// Route::middleware('auth:sanctum')->get('/profile', function (Request $request) {
//     return $request->user();
// });

// Route::patch('/profile', [ProfileController::class, 'update'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->patch('/profile', [ProfileController::class, 'update']);

Route::middleware([])->group(function () {
    Route::get('/location/locations', [LocationController::class, 'getlocations']);    
    Route::get('/location/states', [LocationController::class, 'getstates']);
    Route::get('/location/cities', [LocationController::class, 'getcities']);
    Route::get('/location/zipcodes', [LocationController::class, 'getzipcodes']);
    Route::get('/location/reverse', [LocationController::class, 'reverseGeocode']);
});

// Route::middleware([])->group(function () {
Route::middleware('auth:sanctum')->group(function () { // Need to uncomment if token is working
    // Fetch messages between authenticated user and another user
    
    Route::get('/messages/ad/{adId}/type/{adType}/user/{userId}', [MessageController::class, 'getMessagesForAd']);

    Route::get('/messages/sent', [MessageController::class, 'getMessagesBySender']);
    Route::get('/messages/{userId}', [MessageController::class, 'index']);
    
    // Send a message
    Route::post('/messages', [MessageController::class, 'store']);
});

// Need to uncommented in production
Route::middleware('auth:sanctum')->group(function () { 
// Route::middleware([])->group(function () {
    Route::post('/cars/dummy-insert', [CarController::class, 'dummyInsert']);
    Route::get('/cars', [CarController::class, 'index']);
    Route::post('/cars', [CarController::class, 'store']);
    Route::get('/cars/make', [CarController::class, 'getcarmakes']);
    Route::get('/cars/models', [CarController::class, 'getcarmodels']);
    Route::get('/cars/{id}', [CarController::class, 'show'])->where('id', '[0-9]+');
    Route::put('/cars/{id}', [CarController::class, 'update'])->where('id', '[0-9]+');
    Route::delete('/cars/{id}', [CarController::class, 'destroy'])->where('id', '[0-9]+');
    Route::post('/cars/search', [CarController::class, 'search']);     // Search the cars
});

Route::middleware('auth:sanctum')->group(function () {
// Route::middleware([])->group(function () {
    Route::get('/homes', [HomesController::class, 'index']);        // Get list of homes
    Route::post('/homes', [HomesController::class, 'store']);            // Create a new home listing
    Route::post('/homes/dummy-insert', [HomesController::class, 'dummyInsert']);
    Route::get('/homes/{id}', [HomesController::class, 'show']);         // Get details of a specific home
    Route::put('/homes/{id}', [HomesController::class, 'update']);       // Update an existing home listing
    Route::delete('/homes/{id}', [HomesController::class, 'destroy']);   // Delete a home listing
    Route::post('/homes/search', [HomesController::class, 'search']);     // Search the room mate
});

Route::middleware('auth:sanctum')->group(function () {
// Route::middleware([])->group(function () {
    Route::prefix('rentalhomes')->group(function () {
        Route::get('/', [RentalHomesController::class, 'index']);               // GET /api/rentalhomes - List all rental homes
        Route::post('/', [RentalHomesController::class, 'store']);              // POST /api/rentalhomes - Create a new rental home
        Route::post('/dummy-insert', [RentalHomesController::class, 'dummyInsert']);    // GET /api/rentalhomes/dummy - Insert a dummy rental home
        Route::get('/{id}', [RentalHomesController::class, 'show'])->where('id', '[0-9]+');            // GET /api/rentalhomes/{id} - Show a specific rental home
        Route::put('/{id}', [RentalHomesController::class, 'update'])->where('id', '[0-9]+');          // PUT /api/rentalhomes/{id} - Update a specific rental home
        Route::delete('/{id}', [RentalHomesController::class, 'destroy'])->where('id', '[0-9]+');      // DELETE /api/rentalhomes/{id} - Delete a specific rental home
        Route::post('/search', [RentalHomesController::class, 'search']);     // Search the room mate
    });
});

Route::middleware('auth:sanctum')->group(function () {
// Route::middleware([])->group(function () {
    Route::prefix('roommates')->group(function () {
        Route::get('/', [RoomMatesController::class, 'index']);             // List all room mates
        Route::post('/', [RoomMatesController::class, 'store']);            // Create a new room mate
        Route::post('/search', [RoomMatesController::class, 'search']);     // Search the room mate
        Route::get('/{id}', [RoomMatesController::class, 'show']);          // Show a specific room mate
        Route::put('/{id}', [RoomMatesController::class, 'update']);        // Update a specific room mate
        Route::delete('/{id}', [RoomMatesController::class, 'destroy']);    // Delete a specific room mate
        Route::post('/dummy-insert', [RoomMatesController::class, 'dummyInsert']); // Insert dummy data for testing
    });
});

Route::middleware('auth:sanctum')->group(function () { 
// Route::middleware([])->group(function () {
    Route::prefix('trainingads')->group(function () {
        // Get all training ads
        Route::get('/', [TrainingAdsController::class, 'index']);

        // Create a new training ad
        Route::post('/', [TrainingAdsController::class, 'store']);

        // Get a specific training ad by ID
        Route::get('/{id}', [TrainingAdsController::class, 'show']);

        // Update a specific training ad by ID
        Route::put('/{id}', [TrainingAdsController::class, 'update']);

        // Delete a specific training ad by ID
        Route::delete('/{id}', [TrainingAdsController::class, 'destroy']);

        // Insert dummy data into the training ads table
        Route::post('/dummy-insert', [TrainingAdsController::class, 'dummyInsert']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
// Route::middleware([])->group(function () {
    Route::prefix('astrologyads')->group(function () {
    // Get list of astrology ads
    Route::get('/', [AstrologyAdsController::class, 'index'])->name('astrologyads.index');

    // Create a new astrology ad
    Route::post('/', [AstrologyAdsController::class, 'store'])->name('astrologyads.store');

    // Get details of a specific astrology ad
    Route::get('/{id}', [AstrologyAdsController::class, 'show'])->name('astrologyads.show');

    // Update an existing astrology ad
    Route::put('/{id}', [AstrologyAdsController::class, 'update'])->name('astrologyads.update');

    // Delete a specific astrology ad
    Route::delete('/{id}', [AstrologyAdsController::class, 'destroy'])->name('astrologyads.destroy');

    // Insert dummy data into the astrology ads table
    Route::post('/dummy-insert', [AstrologyAdsController::class, 'dummyInsert']);
    });
});

Route::middleware('auth:sanctum')->group(function () { 
// Route::middleware([])->group(function () {
    Route::prefix('classesforkidsads')->group(function () {
        // Get list of all classes for kids ads
        Route::get('/', [ClassesforKidsAdsController::class, 'index']);
        
        // Insert a dummy class for kids ad
        Route::post('/dummy-insert', [ClassesforKidsAdsController::class, 'dummyInsert']);
        
        // Create a new class for kids ad
        Route::post('/', [ClassesforKidsAdsController::class, 'store']);
        
        // Get details of a specific class for kids ad
        Route::get('{id}', [ClassesforKidsAdsController::class, 'show']);
        
        // Update an existing class for kids ad
        Route::put('{id}', [ClassesforKidsAdsController::class, 'update']);
        
        // Delete a class for kids ad
        Route::delete('{id}', [ClassesforKidsAdsController::class, 'destroy']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
// Route::middleware([])->group(function () {
    Route::prefix('travelcompanions')->group(function () {
        Route::get('/', [TravelCompanionsController::class, 'index']);
        Route::post('/dummy-insert', [TravelCompanionsController::class, 'dummyInsert']);
        Route::post('/', [TravelCompanionsController::class, 'store']);
        Route::post('/findcomplocation', [TravelCompanionsController::class, 'findcomplocation']);
        Route::get('/{id}', [TravelCompanionsController::class, 'show']);
        Route::put('/{id}', [TravelCompanionsController::class, 'update']);
        Route::delete('/{id}', [TravelCompanionsController::class, 'destroy']);
    });
});

// Route::middleware('auth:sanctum')->group(function () {
Route::middleware([])->group(function () {
    Route::prefix('events')->group(function () {
        Route::get('/', [EventsController::class, 'index']);
        Route::post('/', [EventsController::class, 'store']);
        Route::get('/{id}', [EventsController::class, 'show']);
        Route::put('/{id}', [EventsController::class, 'update']);
        Route::delete('/{id}', [EventsController::class, 'destroy']);
    });
});
