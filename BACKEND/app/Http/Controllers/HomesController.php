<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BuySellHome;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use OpenApi\Annotations as OA;
use Faker\Factory as Faker;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

/**
* @OA\Schema(
*     schema="BuySellHomes",
*     @OA\Property(property="id", type="integer", example=1, description="Auto-incremented unique identifier for the home listing"),
*     @OA\Property(property="user_type", type="string", enum={"Agent", "Owner"}, example="Agent", description="Type of user listing the home"),
*     @OA\Property(property="home_type", type="string", enum={"Condominum", "Single family", "Town home"}, example="Single family", description="Type of home"),
*     @OA\Property(property="price", type="number", format="decimal", example=250000.00, description="Price of the home"),
*     @OA\Property(property="price_per_sqft", type="number", format="decimal", nullable=true, example=200.00, description="Price per square foot (optional)"),
*     @OA\Property(property="built_area", type="number", format="decimal", nullable=true, example=1200.50, description="Built area in square feet (optional)"),
*     @OA\Property(property="lot_size", type="number", format="decimal", nullable=true, example=5000.75, description="Lot size in square feet (optional)"),
*     @OA\Property(property="total_parking_spaces", type="integer", nullable=true, example=2, description="Total number of parking spaces (optional)"),
*     @OA\Property(property="attached_garage", type="boolean", nullable=true, example=true, description="Indicates if there is an attached garage (optional)"),
*     @OA\Property(property="hoa_fees", type="number", format="decimal", nullable=true, example=150.00, description="Homeowner Association fees (optional)"),
*     @OA\Property(property="year_built", type="integer", nullable=true, example=2005, description="Year the home was built (optional)"),
*     @OA\Property(property="under_construction", type="boolean", nullable=true, example=false, description="Indicates if the home is under construction (optional)"),
*     @OA\Property(property="bedroom_total", type="integer", nullable=true, example=4, description="Total number of bedrooms (optional)"),
*     @OA\Property(property="half_bathroom_total", type="integer", nullable=true, example=1, description="Total number of half bathrooms (optional)"),
*     @OA\Property(property="full_bathroom_total", type="integer", nullable=true, example=2, description="Total number of full bathrooms (optional)"),
*     @OA\Property(property="total_bathroom_total", type="integer", nullable=true, example=3, description="Total number of bathrooms (optional)"),
*     @OA\Property(property="basement_size", type="number", format="decimal", nullable=true, example=800.00, description="Size of the basement in square feet (optional)"),
*     @OA\Property(property="basement_status", type="string", enum={"Finished", "Unfinished", "Semi finished"}, nullable=true, example="Finished", description="Status of the basement (optional)"),
*     @OA\Property(property="laundry_in_house", type="boolean", nullable=true, example=true, description="Indicates if laundry is in the house (optional)"),
*     @OA\Property(property="home_level", type="integer", nullable=true, example=2, description="Number of levels in the home (optional)"),
*     @OA\Property(property="pool", type="boolean", nullable=true, example=false, description="Indicates if the home has a pool (optional)"),
*     @OA\Property(property="community_pool", type="boolean", nullable=true, example=false, description="Indicates if the community has a pool (optional)"),
*     @OA\Property(property="annual_tax_amount", type="number", format="decimal", nullable=true, example=2500.00, description="Annual property tax amount (optional)"),
*     @OA\Property(property="images", type="array", @OA\Items(type="string"), example={"house1.jpg", "house2.jpg"}),
*     @OA\Property(property="description", type="string", nullable=true, example="Beautiful family home with modern amenities.", description="Detailed description of the home (optional)"),
*     @OA\Property(property="kitchen_granite_countertop", type="boolean", nullable=true, example=true, description="Indicates if the kitchen has granite countertops (optional)"),
*     @OA\Property(property="solar_setup", type="boolean", nullable=true, example=true, description="Indicates if the home has a solar setup (optional)"),
*     @OA\Property(property="fireplace_count", type="integer", nullable=true, example=1, description="Number of fireplaces in the home (optional)"),
*     @OA\Property(property="flooring", type="array", items=@OA\Items(type="string", enum={"Wood", "Vinyl", "Carpet", "Ceramic Tile"}), nullable=true, example={"Wood", "Ceramic Tile"}, description="Flooring types available in the home (optional)"),
*     @OA\Property(property="location_state", type="string", example="California"),
*     @OA\Property(property="location_city", type="string", example="Los Angeles"),
*     @OA\Property(property="location_zipcode", type="string", example="90001"),
*     @OA\Property(property="seller_id", type="integer", nullable=true, example=1, description="Foreign key referencing the `Users` table (optional)"),
*     @OA\Property(property="seller_name", type="string", example="John Doe"),
*     @OA\Property(property="created_at", type="string", format="date-time", nullable=true, example="2024-10-10T14:48:00Z", description="Timestamp when the record was created"),
*     @OA\Property(property="updated_at", type="string", format="date-time", nullable=true, example="2024-10-12T09:30:00Z", description="Timestamp when the record was last updated")
* )
*/
class HomesController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/homes",
     *     summary="Get list of homes",
     *     tags={"Homes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="List of homes")
     * )
     */
    public function adminIndex(Request $request)
    {
        $query = BuySellHome::query();

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('location_city', 'like', "%{$search}%")
                  ->orWhere('location_state', 'like', "%{$search}%")
                  ->orWhere('home_type', 'like', "%{$search}%")
                  ->orWhere('seller_name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $results = $query->orderBy('created_at', 'desc')->paginate(20);

        $results->getCollection()->transform(function ($item) {
            if (is_string($item->images) && !empty($item->images)) {
                $item->images = json_decode($item->images, true);
            }
            return $item;
        });

        return response()->json($results);
    }

    public function adminToggleStatus(Request $request, $id)
    {
        $item = BuySellHome::findOrFail($id);
        $item->status = ($item->status === 'active' || $item->status === 'approved') ? 'pending' : 'active';
        $item->save();
        return response()->json(['success' => true, 'status' => $item->status]);
    }

    public function index(Request $request)
    {
        // Removed repairServerPaths as it causes the API to hang on Azure Production

        $perPage = 12;
        $query = BuySellHome::query()->where('status', 'active');

        // Admin search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('location_city', 'like', "%{$search}%")
                  ->orWhere('location_state', 'like', "%{$search}%")
                  ->orWhere('location_zipcode', 'like', "%{$search}%")
                  ->orWhere('home_type', 'like', "%{$search}%")
                  ->orWhere('seller_name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'price-asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price-desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'created_at-desc':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'area-desc':
                    $query->orderBy('built_area', 'desc');
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
                    break;
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $buysellhomes = $query->paginate($perPage);

        $buysellhomes->getCollection()->transform(function ($buysellhome) {
            if (is_string($buysellhome->images) && !empty($buysellhome->images)) {
                $buysellhome->images = json_decode($buysellhome->images, true);
            }
            return $buysellhome;
        });

        return response()->json($buysellhomes);
    }

     /**
     * Dummy Insert API for BuySellHome
     *
     * @return \Illuminate\Http\JsonResponse
     */
    /**
     * @OA\Post(
     *     path="/api/homes/dummy-insert",
     *     summary="Insert a dummy homes",
     *     tags={"Homes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=201, description="Dummy homes added successfully")
     * )
     */
    public function dummyInsert()
    {
        $faker = Faker::create();

        $photos = [];
        $directory = storage_path('app/public/buysellhomes');

        if (!file_exists($directory)) {
            mkdir($directory, 0755, true);
        }

        for ($i = 0; $i < 3; $i++) {
            $filename = Str::random(10) . '.jpg';
            $fullPath = $directory . '/' . $filename;

            // Create a blank white image
            $image = imagecreatetruecolor(640, 480);
            $white = imagecolorallocate($image, 255, 255, 255);
            imagefilledrectangle($image, 0, 0, 640, 480, $white);

            imagejpeg($image, $fullPath);
            imagedestroy($image);

            $photos[] = 'storage/buysellhomes/' . $filename;
        }

        $posterId = $faker->numberBetween(2, 4);

        // Fetch the user name from the database using poster_id
        $receiver = User::find($posterId);

        $posterName = $receiver ? $receiver->name : 'Unknown User';

        $dummyData = [
            'user_type' => $faker->randomElement(['Agent', 'Owner']),
            'home_type' => $faker->randomElement(['Condominum', 'Single family', 'Town home']),
            'price' => $faker->randomFloat(2, 50000, 500000),
            'price_per_sqft' => $faker->randomFloat(2, 100, 500),
            'built_area' => $faker->randomFloat(2, 500, 4000),
            'lot_size' => $faker->randomFloat(2, 1000, 10000),
            'total_parking_spaces' => $faker->numberBetween(1, 5),
            'attached_garage' => $faker->boolean,
            'hoa_fees' => $faker->randomFloat(2, 0, 500),
            'year_built' => $faker->numberBetween(1900, 2023),
            'under_construction' => $faker->boolean,
            'bedroom_total' => $faker->numberBetween(1, 10),
            'half_bathroom_total' => $faker->numberBetween(0, 2),
            'full_bathroom_total' => $faker->numberBetween(1, 5),
            'total_bathroom_total' => $faker->numberBetween(1, 7),
            'basement_size' => $faker->randomFloat(2, 0, 2000),
            'basement_status' => $faker->randomElement(['Finished', 'Unfinished', 'Semi finished']),
            'laundry_in_house' => $faker->boolean,
            'home_level' => $faker->numberBetween(1, 3),
            'pool' => $faker->boolean,
            'community_pool' => $faker->boolean,
            'annual_tax_amount' => $faker->randomFloat(2, 1000, 10000),
            'images' => json_encode($photos),
            'description' => $faker->paragraph,
            'kitchen_granite_countertop' => $faker->boolean,
            'solar_setup' => $faker->boolean,
            'fireplace_count' => $faker->numberBetween(0, 3),
            'flooring' => implode(',', $faker->randomElements(['Wood', 'Vinyl', 'Carpet', 'Ceramic Tile'], $faker->numberBetween(1, 4))),
            //'seller_id' => Auth::id(),
            'location_state' => $faker->state,
            'location_city' => $faker->city,
            'location_zipcode' => $faker->postcode,
            'seller_id' => $posterId,
            'seller_name' => $posterName
        ];

        $home = BuySellHome::create($dummyData);

        return response()->json([
            'message' => 'Dummy home added successfully',
            'data' => $home
        ], 201);
    }

    /**
 * @OA\Post(
 *     path="/api/homes",
 *     summary="Create a new home listing",
 *     tags={"Homes"},
 *     security={{"bearerAuth":{}}},
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"user_type", "home_type", "price"},
 *             @OA\Property(property="user_type", type="string", enum={"Agent", "Owner"}, example="Owner"),
 *             @OA\Property(property="home_type", type="string", enum={"Condominum", "Single family", "Town home"}, example="Single family"),
 *             @OA\Property(property="price", type="number", format="float", example=350000),
 *             @OA\Property(property="built_area", type="number", format="float", example=1200.5),
 *             @OA\Property(property="lot_size", type="number", format="float", example=5000.5),
 *             @OA\Property(property="hoa_fees", type="number", format="float", example=200.5),
 *             @OA\Property(property="year_built", type="integer", example=2010),
 *             @OA\Property(property="under_construction", type="boolean", example=false),
 *             @OA\Property(property="bedroom_total", type="integer", example=3),
 *             @OA\Property(property="half_bathroom_total", type="integer", example=1),
 *             @OA\Property(property="full_bathroom_total", type="integer", example=2),
 *             @OA\Property(property="basement_size", type="number", format="float", example=500.75),
 *             @OA\Property(property="basement_status", type="string", enum={"Finished", "Unfinished", "Semi finished"}, example="Finished"),
 *             @OA\Property(property="laundry_in_house", type="boolean", example=true),
 *             @OA\Property(property="home_level", type="integer", example=2),
 *             @OA\Property(property="pool", type="boolean", example=true),
 *             @OA\Property(property="annual_tax_amount", type="number", format="float", example=1500.25),
 *             @OA\Property(property="images", type="array", @OA\Items(type="string"), example={"house1.jpg", "house2.jpg"}),
 *             @OA\Property(property="location_state", type="string", example="California"),
 *             @OA\Property(property="location_city", type="string", example="Los Angeles"),
 *             @OA\Property(property="location_zipcode", type="string", example="90001"),
 *             @OA\Property(property="description", type="string", example="A beautiful single-family home in the suburbs"),
 *             @OA\Property(property="kitchen_granite_countertop", type="boolean", example=true),
 *             @OA\Property(property="fireplace_count", type="integer", example=1),
 *             @OA\Property(property="flooring", type="array", @OA\Items(type="string", enum={"Wood", "Vinyl", "Carpet", "Ceramic Tile"}), example={"Wood", "Carpet"}),
 *             @OA\Property(property="seller_id", type="integer", example=1),
 *             @OA\Property(property="seller_name", type="string", example="John Doe"),
 *         )
 *     ),
 *     @OA\Response(response=201, description="Home created successfully")
 * )
 */
    public function store(Request $request)
    {
        $request->validate([
            'user_type' => 'required|in:Agent,Owner',
            'home_type' => 'required|in:Condominum,Single family,Town home',
            'price' => 'required|numeric',
            'price_per_sqft' => 'nullable|numeric',
            'built_area' => 'nullable|numeric',
            'lot_size' => 'nullable|numeric',
            'total_parking_spaces' => 'nullable|integer',
            'attached_garage' => 'nullable|boolean',
            'hoa_fees' => 'nullable|numeric',
            'year_built' => 'nullable|integer', 
            'under_construction' => 'nullable|boolean',
            'bedroom_total' => 'nullable|integer',
            'half_bathroom_total' => 'nullable|integer',
            'full_bathroom_total' => 'nullable|integer',
            'total_bathroom_total' => 'nullable|integer',
            'basement_size' => 'nullable|numeric',
            'basement_status' => 'nullable|in:Finished,Unfinished,Semi finished',
            'laundry_in_house' => 'nullable|boolean',
            'home_level' => 'nullable|integer',
            'pool' => 'nullable|boolean',
            'community_pool' => 'nullable|boolean',
            'annual_tax_amount' => 'nullable|numeric', 
            'images' => 'nullable|array',
            'images.*' => ['nullable', 'string', function ($attribute, $value, $fail) {
                // Check if the value is a valid base64-encoded image
                if (!preg_match('/^data:image\/\w+;base64,/', $value)) {
                    $fail('The ' . $attribute . ' must be a valid base64 encoded image.');
                }
                // Validate the decoded image size
                $imageData = substr($value, strpos($value, ',') + 1);
                $imageData = base64_decode($imageData);
                if (strlen($imageData) > 2 * 1024 * 1024) { // 2MB limit
                    $fail('The ' . $attribute . ' must be less than 2MB.');
                }
            }],
            'location_state' => 'nullable|string|max:100',
            'location_city' => 'nullable|string|max:100',
            'location_zipcode' => 'nullable|string|max:20',
            'description' => 'nullable|string|max:1000',
            'kitchen_granite_countertop' => 'nullable|boolean',
            'solar_setup' => 'nullable|boolean',
            'fireplace_count' => 'nullable|integer',
            'flooring' => 'nullable|array',
            'flooring.*' => 'in:Wood,Vinyl,Carpet,Ceramic Tile',
            'seller_id' => 'nullable|exists:users,id',
            'seller_name' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:255'
        ]);

        $receiver = User::find($request->seller_id);
        if (!$receiver) {
            return response()->json(['error' => 'User not found'], 404);
        }
        $data = $request->except('images'); // get all fields except photos
        $data['seller_name'] = $receiver->name;
        $data['status'] = 'active';

        // Sync coordinates
        if ($request->filled('location_zipcode')) {
            $coords = \DB::table('usa_zipcodes')->where('zip', $request->location_zipcode)->first();
            if ($coords) {
                $data['latitude'] = $coords->lat;
                $data['longitude'] = $coords->lng;
            }
        }

        if (isset($data['flooring']) && is_array($data['flooring'])) {
            $data['flooring'] = implode(',', $data['flooring']);
        }

        if ($request->has('images') && !empty($request->images)) {
            $photos = [];
            $disk = env('FILESYSTEM_DISK', 'public');

            foreach ($request->images as $base64Image) {
                // Get the file extension
                preg_match('/data:image\/(.*);base64/', $base64Image, $matches);
                $extension = $matches[1];  // e.g., 'jpeg', 'png'
                
                // Decode the base64 string
                $imageData = base64_decode(preg_replace('/^data:image\/\w+;base64,/', '', $base64Image));
                
                // Generate a unique filename for the image
                $filename = uniqid() . '.' . $extension;
                $path = 'buysellhomes/' . $filename;
                
                // Store using Storage facade
                \Illuminate\Support\Facades\Storage::disk($disk)->put($path, $imageData);
                
                // Add the URL/path to the array
                $photos[] = $disk === 'public' ? 'storage/' . $path : \Illuminate\Support\Facades\Storage::disk($disk)->url($path);
            }
            
            // Store the photos array as JSON in the database
            $data['images'] = json_encode($photos);
        }

        $home = BuySellHome::create($data);

        return response()->json(['message' => 'Home listing added successfully', 'data' => $home], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/homes/{id}",
     *     summary="Get details of a specific home",
     *     tags={"Homes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Home ID", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Home details")
     * )
     */
    public function show($id)
    {
        $home = BuySellHome::find($id);

        if (!$home) {
            return response()->json(['message' => 'Home not found'], 404);
        }

        if (!empty($home->images) && is_string($home->images)) {
            $home->images = json_decode($home->images, true);
        }

        return response()->json($home);
    }

    /**
     * @OA\Post(
     *     path="/api/homes/search",
     *     summary="Search for Buy Sell homes based on filters",
     *     tags={"Homes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="city", type="string", example="Los Angeles"),
     *             @OA\Property(property="zipcode", type="string", example="90001"),
     *             @OA\Property(property="houseType", type="string", example="Apartment")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful search",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/BuySellHomes")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No Buy Sell Homes found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="No Buy Sell home found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     */
    public function search(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'city' => 'nullable|string|max:100',
            'zipcode' => 'nullable|string|max:20',
            'houseType' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = BuySellHome::query()->where('status', 'active');

        $city = trim($request->city);
        $zipcode = trim($request->zipcode);
        $radius = 70; // Miles

        $centerPoint = null;

        // Try to get coordinates for the search center
        if ($zipcode) {
            $centerPoint = \DB::table('usa_zipcodes')->where('zip', $zipcode)->first();
        } elseif ($city) {
            $centerPoint = \DB::table('usa_zipcodes')
                ->where('city', 'like', '%' . $city . '%')
                ->first();
        }

        if ($centerPoint && $centerPoint->lat && $centerPoint->lng) {
            $lat = $centerPoint->lat;
            $lng = $centerPoint->lng;
            $searchZip = $centerPoint->zip;

            // Bounding box optimization to reduce rows before expensive distance calculation
            $latRange = $radius / 69;
            $lngRange = $radius / (69 * cos(deg2rad($lat)));

            $query->where(function ($q) use ($lat, $latRange, $lng, $lngRange, $searchZip) {
                $q->where('location_zipcode', $searchZip)
                  ->orWhere(function ($subQ) use ($lat, $latRange, $lng, $lngRange) {
                      $subQ->whereNotNull('latitude')
                           ->whereNotNull('longitude')
                           ->whereBetween('latitude', [$lat - $latRange, $lat + $latRange])
                           ->whereBetween('longitude', [$lng - $lngRange, $lng + $lngRange]);
                  });
            });

            $query->select('*')
                ->selectRaw("IFNULL((3959 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))), 9999) AS distance", [$lat, $lng, $lat])
                ->havingRaw("distance <= ? OR location_zipcode = ?", [$radius, $searchZip]);
            
            // Priority ordering: exact zip first, then by distance
            $query->orderByRaw("CASE WHEN location_zipcode = ? THEN 0 ELSE 1 END ASC", [$searchZip])
                  ->orderBy('distance', 'asc');
        } else {
            // Fallback to basic keyword matching if no coordinates found
            $query->where(function ($q) use ($request) {
                if ($request->filled('city')) {
                    $q->orWhere('location_city', 'like', '%' . $request->city . '%');
                }
                if ($request->filled('zipcode')) {
                    $q->orWhere('location_zipcode', 'like', '%' . $request->zipcode . '%');
                }
            });
        }

        if ($request->filled('houseType')) {
            $houseTypes = is_array($request->houseType) ? $request->houseType : [$request->houseType];
            $mappedTypes = [];
            foreach ($houseTypes as $type) {
                if (strcasecmp($type, 'Condominium') === 0 || strcasecmp($type, 'Condominum') === 0) {
                    $mappedTypes[] = 'Condominum';
                } elseif (strcasecmp($type, 'Single Family') === 0 || strcasecmp($type, 'Single family') === 0) {
                    $mappedTypes[] = 'Single family';
                } elseif (strcasecmp($type, 'Townhouse') === 0 || strcasecmp($type, 'Town home') === 0) {
                    $mappedTypes[] = 'Town home';
                } else {
                    $mappedTypes[] = $type;
                }
            }
            $query->where(function ($q) use ($mappedTypes) {
                foreach ($mappedTypes as $type) {
                    $q->orWhere('home_type', 'like', '%' . $type . '%');
                }
            });
        }

        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'price-asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price-desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'created_at-desc':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'area-desc':
                    $query->orderBy('built_area', 'desc');
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
                    break;
            }
        } else {
             $query->orderBy('created_at', 'desc');
        }

        $perPage = 12;
        $buysellhomes = $query->paginate($perPage);

        // Automatically decode JSON-encoded 'photos' field to an array
        $buysellhomes->getCollection()->transform(function ($buysellhome) {
            if (is_string($buysellhome->images) && !empty($buysellhome->images)) {
                $buysellhome->images = json_decode($buysellhome->images, true);
            }
            return $buysellhome;
        });

        return response()->json($buysellhomes);
    }

    /**
 * @OA\Put(
 *     path="/api/homes/{id}",
 *     summary="Update an existing home listing",
 *     tags={"Homes"},
 *     security={{"bearerAuth":{}}},
 *     @OA\Parameter(name="id", in="path", required=true, description="Home ID", @OA\Schema(type="integer")),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             @OA\Property(property="user_type", type="string", enum={"Agent", "Owner"}, example="Owner"),
 *             @OA\Property(property="home_type", type="string", enum={"Condominum", "Single family", "Town home"}, example="Single family"),
 *             @OA\Property(property="price", type="number", format="float", example=355000),
 *             @OA\Property(property="built_area", type="number", format="float", example=1200.5),
 *             @OA\Property(property="lot_size", type="number", format="float", example=5000.5),
 *             @OA\Property(property="hoa_fees", type="number", format="float", example=200.5),
 *             @OA\Property(property="year_built", type="integer", example=2010),
 *             @OA\Property(property="under_construction", type="boolean", example=false),
 *             @OA\Property(property="bedroom_total", type="integer", example=3),
 *             @OA\Property(property="half_bathroom_total", type="integer", example=1),
 *             @OA\Property(property="full_bathroom_total", type="integer", example=2),
 *             @OA\Property(property="basement_size", type="number", format="float", example=500.75),
 *             @OA\Property(property="basement_status", type="string", enum={"Finished", "Unfinished", "Semi finished"}, example="Finished"),
 *             @OA\Property(property="laundry_in_house", type="boolean", example=true),
 *             @OA\Property(property="home_level", type="integer", example=2),
 *             @OA\Property(property="pool", type="boolean", example=true),
 *             @OA\Property(property="annual_tax_amount", type="number", format="float", example=1500.25),
 *             @OA\Property(property="images", type="array", @OA\Items(type="string"), example={"house1.jpg", "house2.jpg"}),
 *             @OA\Property(property="description", type="string", example="An updated description of the beautiful single-family home"),
 *             @OA\Property(property="location_state", type="string", example="California"),
 *             @OA\Property(property="location_city", type="string", example="Los Angeles"),
 *             @OA\Property(property="location_zipcode", type="string", example="90001"),
 *             @OA\Property(property="kitchen_granite_countertop", type="boolean", example=true),
 *             @OA\Property(property="fireplace_count", type="integer", example=1),
 *             @OA\Property(property="flooring", type="array", @OA\Items(type="string", enum={"Wood", "Vinyl", "Carpet", "Ceramic Tile"}), example={"Wood", "Carpet"}),
 *             @OA\Property(property="seller_id", type="integer", example=1),
 *             @OA\Property(property="seller_name", type="string", example="John Doe")
 *         )
 *     ),
 *     @OA\Response(response=200, description="Home updated successfully")
 * )
 */
    public function update(Request $request, $id)
    {
        $home = BuySellHome::find($id);

        if (!$home) {
            return response()->json(['message' => 'Home not found'], 404);
        }

        $request->validate([
            'user_type' => 'sometimes|in:Agent,Owner',
            'home_type' => 'sometimes|in:Condominum,Single family,Town home',
            'price' => 'sometimes|numeric',
            'status' => 'nullable|in:active,inactive',
            'price_per_sqft' => 'nullable|numeric',
            'built_area' => 'nullable|numeric',
            'lot_size' => 'nullable|numeric',
            'total_parking_spaces' => 'nullable|integer',
            'attached_garage' => 'nullable|boolean',
            'hoa_fees' => 'nullable|numeric',
            'year_built' => 'nullable|integer',
            'under_construction' => 'nullable|boolean',
            'bedroom_total' => 'nullable|integer',
            'half_bathroom_total' => 'nullable|integer', 
            'full_bathroom_total' => 'nullable|integer',
            'total_bathroom_total' => 'nullable|integer',
            'basement_size' => 'nullable|numeric',
            'basement_status' => 'nullable|in:Finished,Unfinished,Semi finished',
            'laundry_in_house' => 'nullable|boolean',
            'home_level' => 'nullable|integer',
            'pool' => 'nullable|boolean',
            'community_pool' => 'nullable|boolean',
            'annual_tax_amount' => 'nullable|numeric',
            'images' => 'nullable|array', 
            'images.*' => ['nullable', 'string', function ($attribute, $value, $fail) {
                // Check if the value is a valid base64-encoded image
                if (!preg_match('/^data:image\/\w+;base64,/', $value)) {
                    $fail('The ' . $attribute . ' must be a valid base64 encoded image.');
                }
                // Validate the decoded image size
                $imageData = substr($value, strpos($value, ',') + 1);
                $imageData = base64_decode($imageData);
                if (strlen($imageData) > 2 * 1024 * 1024) { // 2MB limit
                    $fail('The ' . $attribute . ' must be less than 2MB.');
                }
            }],
            'location_state' => 'nullable|string|max:100',
            'location_city' => 'nullable|string|max:100',
            'location_zipcode' => 'nullable|string|max:20',
            'description' => 'nullable|string|max:1000',
            'kitchen_granite_countertop' => 'nullable|boolean',
            'solar_setup' => 'nullable|boolean',
            'fireplace_count' => 'nullable|integer',
            'flooring' => 'nullable|array',
            'flooring.*' => 'in:Wood,Vinyl,Carpet,Ceramic Tile',
            'seller_id' => 'nullable|exists:users,id',
            'seller_name' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:255'
        ]);

        $data = $request->except('images');
        
        if ($request->has('seller_id')) {
            $receiver = User::find($request->seller_id);
            if (!$receiver) {
                return response()->json(['error' => 'User not found'], 404);
            }
            $data['seller_name'] = $receiver->name;
        }

        // Sync coordinates
        if ($request->filled('location_zipcode')) {
            $coords = \DB::table('usa_zipcodes')->where('zip', $request->location_zipcode)->first();
            if ($coords) {
                $data['latitude'] = $coords->lat;
                $data['longitude'] = $coords->lng;
            }
        }

        if (isset($data['flooring']) && is_array($data['flooring'])) {
            $data['flooring'] = implode(',', $data['flooring']);
        }

        if ($request->has('images') && !empty($request->images)) {
            $photos = [];
            $disk = env('FILESYSTEM_DISK', 'public');

            foreach ($request->images as $base64Image) {
                preg_match('/data:image\/(.*);base64/', $base64Image, $matches);
                $extension = $matches[1];

                $imageData = base64_decode(preg_replace('/^data:image\/\w+;base64,/', '', $base64Image));

                $filename = uniqid() . '.' . $extension;
                $path = 'buysellhomes/' . $filename;

                \Illuminate\Support\Facades\Storage::disk($disk)->put($path, $imageData);

                $photos[] = $disk === 'public' ? 'storage/' . $path : \Illuminate\Support\Facades\Storage::disk($disk)->url($path);
            }

            $data['images'] = json_encode($photos);
        }
        
        $home->update($data);

        // Return photos as array in response
        if (is_string($home->images)) {
            $home->images = json_decode($home->images, true);
        }

        return response()->json(['message' => 'Home updated successfully', 'data' => $home]);
    }

    /**
     * @OA\Delete(
     *     path="/api/homes/{id}",
     *     summary="Delete a home listing",
     *     tags={"Homes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Home ID", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Home deleted successfully")
     * )
     */
    public function destroy($id)
    {
        $home = BuySellHome::find($id);

        if (!$home) {
            return response()->json(['message' => 'Home not found'], 404);
        }

        $home->delete();

        return response()->json(['message' => 'Home deleted successfully']);
    }

    private function validateRequest($request)
    {
        // ... (existing validateRequest code)
    }

    /**
     * Repair storage links and framework directories on Azure
     */
    private function repairServerPaths()
    {
        try {
            if (!file_exists(public_path('storage'))) {
                \Illuminate\Support\Facades\Artisan::call('storage:link');
            }

            $frameworkPaths = [
                storage_path('framework/views'),
                storage_path('framework/cache'),
                storage_path('framework/sessions'),
            ];
            foreach ($frameworkPaths as $path) {
                if (!file_exists($path)) {
                    \Illuminate\Support\Facades\File::ensureDirectoryExists($path);
                }
            }
        } catch (\Exception $e) {
            // Silently fail if filesystem is read-only
        }
    }

    public function getMyAdCount(Request $request)
    {
        $count = \App\Models\BuySellHome::where('seller_id', $request->user()->id)->count();
        return response()->json(['count' => $count]);
    }

    public function getMyListings(Request $request)
    {
        $listings = \App\Models\BuySellHome::where('seller_id', $request->user()->id)->get();
        return response()->json($listings);
    }
}
