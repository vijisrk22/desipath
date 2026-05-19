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
use App\Http\Controllers\KidsClassController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\Api\Auth\GoogleAuthController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\EventsController;
use App\Http\Controllers\InstructorController;
use App\Http\Controllers\AirportController;
use App\Http\Controllers\TravelCompanionController;
use App\Http\Controllers\LocalAdsController;
use App\Http\Controllers\AdminManagementController;
use App\Http\Controllers\PhotographerController;
use App\Http\Controllers\RealEstateController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\AttorneyController;

use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;



// Route::options('{any}', function () {
//     return response()->json([], 200)
//         ->header('Access-Control-Allow-Origin', '*')
//         ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
//         ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
// })->where('any', '.*');

Route::post('/auth/google', [GoogleAuthController::class, 'login']);
Route::post('/auth/googlecheck', [GoogleAuthController::class, 'googlecheck']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);

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
    Route::get('/run-migrations', [LocationController::class, 'runMigrations']); // Temp helper
    Route::get('/run-seeders', [LocationController::class, 'runSeeders']); // Temp helper to seed
    Route::get('/run-car-makemodel-seeder', [LocationController::class, 'runCarMakeModelSeeder']); // Seed car make/model
    Route::get('/run-car-attributes', [LocationController::class, 'runCarAttributesSetup']); // Direct DB seed for car attributes
    Route::get('/run-car-makemodel', [LocationController::class, 'runCarMakeModelSetup']); // Direct DB seed for makes/models
    Route::get('/deduplicate-locations', [LocationController::class, 'deduplicateLocations']); // Fast dedup
    Route::get('/location/states', [LocationController::class, 'getstates']);
    Route::get('/location/cities', [LocationController::class, 'getcities']);
    Route::get('/location/zipcodes', [LocationController::class, 'getzipcodes']);
    Route::get('/location/reverse', [LocationController::class, 'reverseGeocode']);
});

// Route::middleware([])->group(function () {
Route::middleware('auth:sanctum')->group(function () { // Need to uncomment if token is working
    // Fetch messages between authenticated user and another user
    
    Route::get('/messages/ad/{adId}/type/{adType}/user/{userId}', [MessageController::class, 'getMessagesForAd']);
    Route::get('/messages/conversations', [MessageController::class, 'getConversations']);

    Route::get('/messages/sent', [MessageController::class, 'getMessagesBySender']);
    Route::get('/messages/{userId}', [MessageController::class, 'index']);
    
    // Send a message
    Route::post('/messages', [MessageController::class, 'store']);
});

// --- Auth Protected User-Specific Data Retrieval ---
Route::middleware('auth:sanctum')->group(function () {
    // High-Performance User Listings (only returns the authenticated user's ads)
    Route::get('/cars/my-listings', [CarController::class, 'getMyListings']);
    Route::get('/rentalhomes/my-listings', [RentalHomesController::class, 'getMyListings']);
    Route::get('/roommates/my-listings', [RoomMatesController::class, 'getMyListings']);
    Route::get('/homes/my-listings', [HomesController::class, 'getMyListings']);
    Route::get('/trainingads/my-listings', [TrainingAdsController::class, 'getMyListings']);
    Route::get('/travelcompanions/my-listings', [TravelCompanionsController::class, 'getMyListings']);
    Route::get('/events/my-listings', [EventsController::class, 'getMyListings']);
    Route::get('/local-ads/my-listings', [LocalAdsController::class, 'myAds']);

    // Ad Statistics Endpoints (High Performance — returns only count)
    Route::get('/cars/my-count', [CarController::class, 'getMyAdCount']);
    Route::get('/rentalhomes/my-count', [RentalHomesController::class, 'getMyAdCount']);
    Route::get('/roommates/my-count', [RoomMatesController::class, 'getMyAdCount']);
    Route::get('/homes/my-count', [HomesController::class, 'getMyAdCount']);
    Route::get('/trainingads/my-count', [TrainingAdsController::class, 'getMyAdCount']);
    Route::get('/travelcompanions/my-count', [TravelCompanionsController::class, 'getMyAdCount']);
    Route::get('/events/my-count', [EventsController::class, 'getMyAdCount']);
    Route::get('/local-ads/my-count', [LocalAdsController::class, 'getMyAdCount']);
    Route::get('/kids-classes/my-count', [KidsClassController::class, 'getMyAdCount']);
    Route::get('/kids-classes/my-listings', [KidsClassController::class, 'getMyListings']);
    Route::get('/realestate/my-count', [RealEstateController::class, 'getMyAdCount']);
    Route::get('/attorneys/my-listings', [AttorneyController::class, 'getMyListings']);
    Route::get('/attorneys/my-count', [AttorneyController::class, 'getMyAdCount']);
});

// Public car read routes (no auth required — anyone can browse listings)
Route::get('/cars', [CarController::class, 'index']);
Route::get('/cars/make', [CarController::class, 'getcarmakes']);
Route::get('/cars/models', [CarController::class, 'getcarmodels']);
Route::get('/cars/attributes', [CarController::class, 'getCarAttributes']);
Route::get('/cars/dummy-insert', [CarController::class, 'dummyInsert']);
Route::get('/cars/{id}', [CarController::class, 'show'])->where('id', '[0-9]+');
Route::post('/cars/search', [CarController::class, 'search']);

// Auth-protected car write routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/cars', [CarController::class, 'store']);
    Route::put('/cars/{id}', [CarController::class, 'update'])->where('id', '[0-9]+');
    Route::delete('/cars/{id}', [CarController::class, 'destroy'])->where('id', '[0-9]+');
});

// --- Public Rental Home Routes ---
Route::prefix('rentalhomes')->group(function () {
    Route::get('/', [RentalHomesController::class, 'index']);
    Route::get('/dummy-insert', [RentalHomesController::class, 'dummyInsert']);
    Route::get('/{id}', [RentalHomesController::class, 'show'])->where('id', '[0-9]+');
    Route::post('/search', [RentalHomesController::class, 'search']);
});

Route::get('/kidsclass/dummy-insert', [KidsClassController::class, 'dummyInsert']);

// --- Public Roommates Routes ---
Route::prefix('roommates')->group(function () {
    Route::get('/', [RoomMatesController::class, 'index']);
    Route::get('/{id}', [RoomMatesController::class, 'show']);
    Route::post('/search', [RoomMatesController::class, 'search']);
});

// --- Public House/Homes Routes ---
Route::prefix('homes')->group(function () {
    Route::get('/', [HomesController::class, 'index']);
    Route::get('/{id}', [HomesController::class, 'show']);
    Route::post('/search', [HomesController::class, 'search']);
});

// --- Auth Protected Write Routes ---
Route::middleware('auth:sanctum')->group(function () {
    // Rental Homes
    Route::post('/rentalhomes', [RentalHomesController::class, 'store']);
    Route::post('/rentalhomes/dummy-insert', [RentalHomesController::class, 'dummyInsert']);
    Route::put('/rentalhomes/{id}', [RentalHomesController::class, 'update'])->where('id', '[0-9]+');
    Route::delete('/rentalhomes/{id}', [RentalHomesController::class, 'destroy'])->where('id', '[0-9]+');
    Route::get('/rentalhomes-admin', [RentalHomesController::class, 'adminIndex']);
    Route::post('/rentalhomes/{id}/toggle-status', [RentalHomesController::class, 'adminToggleStatus']);

    // Admin Zipcodes
    Route::get('/admin/zipcodes', [LocationController::class, 'getAdminZipcodes']);
    
    // Roommates
    Route::post('/roommates', [RoomMatesController::class, 'store']);
    Route::post('/roommates/dummy-insert', [RoomMatesController::class, 'dummyInsert']);
    Route::put('/roommates/{id}', [RoomMatesController::class, 'update']);
    Route::delete('/roommates/{id}', [RoomMatesController::class, 'destroy']);
    Route::get('/roommates-admin', [RoomMatesController::class, 'adminIndex']);
    Route::post('/roommates/{id}/toggle-status', [RoomMatesController::class, 'adminToggleStatus']);

    // Houses/Homes
    Route::post('/homes', [HomesController::class, 'store']);
    Route::post('/homes/dummy-insert', [HomesController::class, 'dummyInsert']);
    Route::put('/homes/{id}', [HomesController::class, 'update']);
    Route::delete('/homes/{id}', [HomesController::class, 'destroy']);
    Route::get('/homes-admin', [HomesController::class, 'adminIndex']);
    Route::post('/homes/{id}/toggle-status', [HomesController::class, 'adminToggleStatus']);
});

// --- Public Training Ads Routes ---
Route::prefix('trainingads')->group(function () {
    Route::get('/', [TrainingAdsController::class, 'index']);
    Route::get('/{id}', [TrainingAdsController::class, 'show']);
});

// --- Public Astrology Ads Routes ---
Route::prefix('astrologyads')->group(function () {
    Route::get('/', [AstrologyAdsController::class, 'index']);
    Route::get('/{id}', [AstrologyAdsController::class, 'show']);
});

// --- Public Real Estate Routes ---
Route::prefix('realestate')->group(function () {
    Route::get('/', [RealEstateController::class, 'index']);
    Route::get('/exchange-rates', [RealEstateController::class, 'getExchangeRates']);
    Route::get('/{id}', [RealEstateController::class, 'show']);
});

// --- Public Classes For Kids Ads (Legacy) Routes ---
Route::prefix('classesforkidsads')->group(function () {
    Route::get('/', [ClassesforKidsAdsController::class, 'index']);
    Route::get('{id}', [ClassesforKidsAdsController::class, 'show']);
});

// --- Public Travel Companion Routes ---
Route::prefix('travelcompanions')->group(function () {
    Route::get('/', [TravelCompanionsController::class, 'index']);
    Route::get('/{id}', [TravelCompanionsController::class, 'show']);
    Route::post('/findcomplocation', [TravelCompanionsController::class, 'findcomplocation']);
});

// --- Auth Protected Write Routes (Remaining Modules) ---
Route::middleware('auth:sanctum')->group(function () {
    // Training Ads
    Route::post('/trainingads', [TrainingAdsController::class, 'store']);
    Route::put('/trainingads/{id}', [TrainingAdsController::class, 'update']);
    Route::delete('/trainingads/{id}', [TrainingAdsController::class, 'destroy']);
    Route::post('/trainingads/dummy-insert', [TrainingAdsController::class, 'dummyInsert']);
    Route::get('/trainingads-admin', [TrainingAdsController::class, 'adminIndex']);
    Route::post('/trainingads/{id}/toggle-status', [TrainingAdsController::class, 'adminToggleStatus']);

    // Astrology Ads
    Route::post('/astrologyads/dummy-insert', [AstrologyAdsController::class, 'dummyInsert']);
    Route::get('/astrologyads/my-listings', [AstrologyAdsController::class, 'getMyListings']);
    Route::post('/astrologyads', [AstrologyAdsController::class, 'store']);
    Route::put('/astrologyads/{id}', [AstrologyAdsController::class, 'update']);
    Route::delete('/astrologyads/{id}', [AstrologyAdsController::class, 'destroy']);

    // Classes For Kids Ads (Legacy)
    Route::post('/classesforkidsads/dummy-insert', [ClassesforKidsAdsController::class, 'dummyInsert']);
    Route::post('/classesforkidsads', [ClassesforKidsAdsController::class, 'store']);
    Route::put('/classesforkidsads/{id}', [ClassesforKidsAdsController::class, 'update']);
    Route::delete('/classesforkidsads/{id}', [ClassesforKidsAdsController::class, 'destroy']);

    // Travel Companions
    Route::post('/travelcompanions/dummy-insert', [TravelCompanionsController::class, 'dummyInsert']);
    Route::post('/travelcompanions', [TravelCompanionsController::class, 'store']);
    Route::put('/travelcompanions/{id}', [TravelCompanionsController::class, 'update']);
    Route::delete('/travelcompanions/{id}', [TravelCompanionsController::class, 'destroy']);
    Route::get('/travelcompanions-admin', [TravelCompanionsController::class, 'adminIndex']);
    Route::post('/travelcompanions/{id}/toggle-status', [TravelCompanionsController::class, 'adminToggleStatus']);

    // Real Estate
    Route::post('/realestate', [RealEstateController::class, 'store']);
    Route::put('/realestate/{id}', [RealEstateController::class, 'update']);
    Route::delete('/realestate/{id}', [RealEstateController::class, 'destroy']);
    Route::get('/realestate/my-listings', [RealEstateController::class, 'getMyListings']);
    
    // Cars
    Route::get('/cars-admin', [CarController::class, 'adminIndex']);
    Route::post('/cars/{id}/toggle-status', [CarController::class, 'adminToggleStatus']);

    // Events Admin
    Route::get('/events-admin', [EventsController::class, 'adminIndex']);
    Route::post('/events/{id}/toggle-status', [EventsController::class, 'adminToggleStatus']);

    // Admin routes
    Route::get('/realestate-admin', [RealEstateController::class, 'adminIndex']);
    Route::post('/realestate/{id}/toggle-status', [RealEstateController::class, 'adminToggleStatus']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('events')->group(function () {
        Route::post('/', [EventsController::class, 'store']);
        Route::put('/{id}', [EventsController::class, 'update']);
        Route::delete('/{id}', [EventsController::class, 'destroy']);
    });
});

Route::prefix('events')->group(function () {
    Route::get('/', [EventsController::class, 'index']);
    Route::post('/search', [EventsController::class, 'search']);
    Route::get('/dummy-insert', [EventsController::class, 'dummyInsert']);
    Route::get('/{id}', [EventsController::class, 'show']);
});

Route::middleware([])->group(function () {
    Route::post('/instructors/upload-photo', [InstructorController::class, 'uploadPhoto']);
    Route::post('/kids-classes', [KidsClassController::class, 'store']);
    Route::get('/kids-classes/admin-listings', [KidsClassController::class, 'getAdminListings']);
    Route::post('/kids-classes/{id}/approve', [KidsClassController::class, 'approve']);
    Route::post('/kids-classes/{id}/reject', [KidsClassController::class, 'reject']);
});
Route::middleware([])->group(function () {
    Route::get('/kids-classes/public/category/{category}/{subcategory}', [KidsClassController::class, 'getPublicByCategory']);
    Route::get('/kids-classes/public/listings', [KidsClassController::class, 'getPublicListings']);
    Route::get('/kids-classes/public/details/{id}', [KidsClassController::class, 'getPublicDetails']);
    Route::get('/kids-classes/keywords', [KidsClassController::class, 'getKeywords']);
    Route::get('/kids-classes/search', [KidsClassController::class, 'search']);
    Route::get('/kids-classes/instructor/{slug}', [KidsClassController::class, 'getBySlug']);
});

// Photography Routes
Route::get('/photography/search', [PhotographerController::class, 'index']);
Route::get('/photography/details/{id}', [PhotographerController::class, 'show']);

Route::middleware(['auth:api'])->group(function () {
    Route::get('/photography/my-count', [PhotographerController::class, 'myCount']);
    Route::get('/photography/my-listings', [PhotographerController::class, 'myListings']);
    Route::post('/photography/store', [PhotographerController::class, 'store']);
    Route::post('/photography/update/{id}', [PhotographerController::class, 'update']);
    Route::delete('/photography/delete/{id}', [PhotographerController::class, 'destroy']);
    Route::post('/photography/toggle-status/{id}', [PhotographerController::class, 'toggleStatus']);
    Route::get('/photography-admin', [PhotographerController::class, 'adminIndex']);
    Route::post('/photography/{id}/toggle-status', [PhotographerController::class, 'adminToggleStatus']);
});
Route::get('/fix-general', function() {
    \DB::table('kids_classes')->where('subcategory', 'General')->update(['subcategory' => 'Keyboard']);
    \DB::table('kids_classes')->where('category', 'Languages')->update(['category' => 'Indian Languages']);
    \DB::table('kids_classes')->update(['status' => 'active']);
    return 'Fixed! All classes set to active and categories aligned.';
});
Route::get('/run-airport-seeder', function() {
    \Artisan::call('db:seed', ['--class' => 'AirportSeeder']);
    return 'Airport database seeded successfully with 487 entries!';
});
Route::middleware([])->group(function () {
    Route::get('/kids-classes/admin/details/{id}', [KidsClassController::class, 'getAdminDetails']);
});
Route::middleware([])->group(function () {
    Route::put('/kids-classes/{id}', [KidsClassController::class, 'update']);
    Route::delete('/kids-classes/{id}', [KidsClassController::class, 'destroy']);
});

// --- IT Training Routes ---
use App\Http\Controllers\ItTrainingController;
Route::middleware([])->group(function () {
    Route::post('/it-training', [ItTrainingController::class, 'store']);
    Route::get('/it-training', [ItTrainingController::class, 'index']);
    Route::get('/it-training/{id}', [ItTrainingController::class, 'show']);
    Route::post('/it-training/leads', [ItTrainingController::class, 'submitLead']);
    Route::get('/it-training/admin/leads', [ItTrainingController::class, 'getLeads']);
    Route::get('/it-training/instructor/{slug}', [ItTrainingController::class, 'getBySlug']);
    Route::get('/it-training-admin', [ItTrainingController::class, 'adminIndex']);
    Route::post('/it-training/{id}/toggle-status', [ItTrainingController::class, 'adminToggleStatus']);
});

// --- Forum Routes ---
use App\Http\Controllers\ForumController;
Route::get('/forum/posts', [ForumController::class, 'index']);
Route::get('/forum/posts/{id}', [ForumController::class, 'show']);
Route::get('/forum/subforums', [ForumController::class, 'listSubforums']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/forum/posts', [ForumController::class, 'storePost']);
    Route::post('/forum/comments', [ForumController::class, 'storeComment']);
    Route::put('/forum/comments/{id}', [ForumController::class, 'updateComment']);
    Route::delete('/forum/comments/{id}', [ForumController::class, 'destroyComment']);
    Route::post('/forum/posts/{id}/vote', [ForumController::class, 'votePost']);
});

// Admin Forum Management
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/admin/forum/subforums', [ForumController::class, 'listSubforums']);
    Route::post('/admin/forum/subforums', [ForumController::class, 'storeSubforum']);
    Route::put('/admin/forum/subforums/{id}', [ForumController::class, 'updateSubforum']);
    Route::delete('/admin/forum/subforums/{id}', [ForumController::class, 'destroySubforum']);
    Route::post('/admin/forum/posts/delete-by-url', [ForumController::class, 'deletePostByUrl']);
});

// --- Marketplace Categories ---
use App\Http\Controllers\MarketplaceCategoryController;
Route::get('/marketplace/categories', [MarketplaceCategoryController::class, 'index']);
Route::middleware([])->group(function () {
    Route::post('/admin/categories', [MarketplaceCategoryController::class, 'store']);
    Route::put('/admin/categories/{id}', [MarketplaceCategoryController::class, 'update']);
    Route::delete('/admin/categories/{id}', [MarketplaceCategoryController::class, 'destroy']);
    Route::post('/admin/categories/{categoryId}/subcategories', [MarketplaceCategoryController::class, 'storeSubcategory']);
    Route::put('/admin/subcategories/{id}', [MarketplaceCategoryController::class, 'updateSubcategory']);
    Route::delete('/admin/subcategories/{id}', [MarketplaceCategoryController::class, 'destroySubcategory']);
});

Route::get('/fix-status-columns', function() {
    $tables = [
        'BuySellHomes',
        'RentalHomes',
        'BuySellCars',
        'RoomMates',
        'TrainingAds',
        'TravelCompanions',
        'events'
    ];
    
    foreach ($tables as $table) {
        if (!Schema::hasColumn($table, 'status')) {
            Schema::table($table, function (Blueprint $tableObj) {
                $tableObj->string('status')->default('active');
            });
        }
    }
    
    // Also update existing to active if they were null or empty
    foreach ($tables as $table) {
        \DB::table($table)->whereNull('status')->orWhere('status', '')->update(['status' => 'active']);
    }
    
    return 'Status columns added and initialized to active for all marketplace tables.';
});

Route::get('/sync-marketplace-coords', function() {
    $models = [
        \App\Models\RoomMate::class,
        \App\Models\RentalHome::class,
        \App\Models\BuySellCar::class,
        \App\Models\BuySellHome::class,
        \App\Models\Event::class
    ];
    
    $count = 0;
    foreach ($models as $modelClass) {
        $items = $modelClass::whereNull('latitude')->orWhere('latitude', '')->get();
        foreach ($items as $item) {
            $zip = $item->location_zipcode ?? $item->dealer_zipcode ?? null;
            if ($zip) {
                $coords = \DB::table('usa_zipcodes')->where('zip', $zip)->first();
                if ($coords) {
                    $item->update([
                        'latitude' => $coords->lat,
                        'longitude' => $coords->lng
                    ]);
                    $count++;
                }
            }
        }
    }
    return "Synced coordinates for $count listings.";
});

Route::get('/users', function() {
    return User::orderBy('id', 'asc')->paginate(100);
});

// Travel Companion V2 Routes
Route::get('/airports/search', [AirportController::class, 'search']);
Route::prefix('travel-companion')->group(function () {
    Route::get('/volunteers', [TravelCompanionController::class, 'browseVolunteers']);
    Route::get('/requests', [TravelCompanionController::class, 'browseRequests']);
});
Route::middleware('auth:sanctum')->prefix('travel-companion')->group(function () {
    Route::post('/requests', [TravelCompanionController::class, 'storeRequest']);
    Route::patch('/requests/{id}', [TravelCompanionController::class, 'storeRequest']);
    Route::post('/volunteer-posts', [TravelCompanionController::class, 'storeVolunteerPost']);
    Route::patch('/volunteer-posts/{id}', [TravelCompanionController::class, 'storeVolunteerPost']);
    Route::get('/my-posts', [TravelCompanionController::class, 'myPosts']);
    Route::post('/reports', [TravelCompanionController::class, 'report']);
});
// --- Local Ads Routes ---
Route::prefix('local-ads')->group(function () {
    Route::get('/', [LocalAdsController::class, 'index']);
    Route::get('/feed', [LocalAdsController::class, 'index']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/local-ads/{id}', [LocalAdsController::class, 'show'])->where('id', '[0-9]+');
    Route::post('/local-ads', [LocalAdsController::class, 'store']);
    Route::put('/local-ads/{id}', [LocalAdsController::class, 'update'])->where('id', '[0-9]+');
    Route::delete('/local-ads/{id}', [LocalAdsController::class, 'destroy'])->where('id', '[0-9]+');
    
    // Admin Actions
    Route::get('/admin/local-ads', [LocalAdsController::class, 'adminIndex']);
    Route::patch('/admin/local-ads/{id}/status', [LocalAdsController::class, 'updateStatus']);
    Route::patch('/admin/local-ads/{id}/expiry', [LocalAdsController::class, 'updateExpiry']);

    // Admin User Management
    Route::get('/admin/users', [AdminManagementController::class, 'index']);
    Route::post('/admin/users', [AdminManagementController::class, 'store']);
    Route::put('/admin/users/{id}', [AdminManagementController::class, 'update']);
    Route::delete('/admin/users/{id}', [AdminManagementController::class, 'destroy']);

    // Protected Doctor Routes
    Route::post('/doctors', [DoctorController::class, 'store']);
    Route::put('/doctors/{id}', [DoctorController::class, 'update'])->where('id', '[0-9]+');
    Route::delete('/doctors/{id}', [DoctorController::class, 'destroy'])->where('id', '[0-9]+');

    // Admin Doctor Moderation
    Route::get('/admin/doctors', [DoctorController::class, 'adminIndex']);
    Route::post('/admin/doctors/{id}/toggle-approval', [DoctorController::class, 'adminToggleApproval'])->where('id', '[0-9]+');

    // Protected Attorney Routes
    Route::post('/attorneys', [AttorneyController::class, 'store']);
    Route::put('/attorneys/{id}', [AttorneyController::class, 'update'])->where('id', '[0-9]+');
    Route::delete('/attorneys/{id}', [AttorneyController::class, 'destroy'])->where('id', '[0-9]+');

    // Admin Attorney Moderation
    Route::get('/admin/attorneys', [AttorneyController::class, 'adminIndex']);
    Route::post('/admin/attorneys/{id}/toggle-approval', [AttorneyController::class, 'adminToggleApproval'])->where('id', '[0-9]+');
    Route::post('/admin/attorneys/{id}/verify-legal-plan', [AttorneyController::class, 'adminVerifyLegalPlan'])->where('id', '[0-9]+');
});

// Public Doctor Directory Routes
Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{slug}', [DoctorController::class, 'show']);

// Public Attorney Directory Routes
Route::get('/attorneys', [AttorneyController::class, 'index']);
Route::get('/attorneys/{slug}', [AttorneyController::class, 'show']);
