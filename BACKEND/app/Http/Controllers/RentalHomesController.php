<?php

namespace App\Http\Controllers;

use App\Models\RentalHome;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use OpenApi\Annotations as OA;
use Faker\Factory as Faker;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;


/**
* @OA\Schema(
*     schema="RentalHome",
*     @OA\Property(property="property_type", type="string", example="Apartment"),
*     @OA\Property(property="available_from", type="string", format="date", example="2024-11-01"),
*     @OA\Property(property="area", type="number", format="decimal", example=850.5),
*     @OA\Property(property="deposit_rent", type="number", format="decimal", example=1500.00),
*     @OA\Property(property="bhk", type="string", example="2 Bed 2 Bath"),
*     @OA\Property(property="address", type="string", example="123 Main St"),
*     @OA\Property(property="community_name", type="string", example="Sunset Valley"),
*     @OA\Property(property="amenities", type="array", @OA\Items(type="string"), example={"Gym", "Club House"}),
*     @OA\Property(property="pets", type="boolean", example=true),
*     @OA\Property(property="images", type="array", @OA\Items(type="string"), example={"house1.jpg", "house2.jpg"}),
*     @OA\Property(property="location_state", type="string", example="California"),
*     @OA\Property(property="location_city", type="string", example="Los Angeles"),
*     @OA\Property(property="location_zipcode", type="string", example="90001"),
*     @OA\Property(property="accommodates", type="integer", example=4),
*     @OA\Property(property="smoking", type="string", example="Not okay"),
*     @OA\Property(property="owner_id", type="integer", example=1),
*     @OA\Property(property="owner_name", type="string", example="John Doe")
* )
*/
class RentalHomesController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/rentalhomes",
     *     summary="Get list of rental homes",
     *     tags={"RentalHomes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="List of rental homes")
     * )
     */
    public function adminIndex(Request $request)
    {
        $query = RentalHome::query();

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('address', 'like', "%{$search}%")
                  ->orWhere('community_name', 'like', "%{$search}%")
                  ->orWhere('location_city', 'like', "%{$search}%")
                  ->orWhere('owner_name', 'like', "%{$search}%");
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
        $item = RentalHome::findOrFail($id);
        $item->status = ($item->status === 'active' || $item->status === 'approved') ? 'pending' : 'active';
        $item->save();
        return response()->json(['success' => true, 'status' => $item->status]);
    }

    public function index(Request $request)
    {
        $perPage = 15;
        $query = RentalHome::query()->where('status', 'active');
        
        // Admin search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('address', 'like', "%{$search}%")
                  ->orWhere('community_name', 'like', "%{$search}%")
                  ->orWhere('location_city', 'like', "%{$search}%")
                  ->orWhere('location_state', 'like', "%{$search}%")
                  ->orWhere('location_zipcode', 'like', "%{$search}%")
                  ->orWhere('property_type', 'like', "%{$search}%");
            });
        }

        // Sorting
        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'price-asc':
                    $query->orderBy('deposit_rent', 'asc');
                    break;
                case 'price-desc':
                    $query->orderBy('deposit_rent', 'desc');
                    break;
                case 'created_at-desc':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'area-desc':
                    $query->orderBy('area', 'desc');
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
                    break;
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $rentalhomes = $query->paginate($perPage);

        // Transform the collection inside the paginator
        $rentalhomes->getCollection()->transform(function ($rentalhome) {
            if (is_string($rentalhome->images) && !empty($rentalhome->images)) {
                $rentalhome->images = json_decode($rentalhome->images, true);
            }
            return $rentalhome;
        });

        return response()->json($rentalhomes);
    }
    
     /**
     * Dummy Insert API for RentalHome
     *
     * @return \Illuminate\Http\JsonResponse
     */
    /**
     * @OA\Post(
     *     path="/api/rentalhomes/dummy-insert",
     *     summary="Insert a dummy rental homes",
     *     tags={"RentalHomes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=201, description="Dummy rental homes added successfully")
     * )
     */
    public function dummyInsert()
    {
        $faker = Faker::create();
        $insertedHomes = [];

        $realCities = [
            ['city' => 'New York', 'state' => 'New York', 'zip' => '10001'],
            ['city' => 'Los Angeles', 'state' => 'California', 'zip' => '90001'],
            ['city' => 'Chicago', 'state' => 'Illinois', 'zip' => '60601'],
            ['city' => 'Houston', 'state' => 'Texas', 'zip' => '77001'],
            ['city' => 'Phoenix', 'state' => 'Arizona', 'zip' => '85001'],
            ['city' => 'Philadelphia', 'state' => 'Pennsylvania', 'zip' => '19101'],
            ['city' => 'San Antonio', 'state' => 'Texas', 'zip' => '78201'],
            ['city' => 'San Diego', 'state' => 'California', 'zip' => '92101'],
            ['city' => 'Dallas', 'state' => 'Texas', 'zip' => '75201'],
            ['city' => 'San Jose', 'state' => 'California', 'zip' => '95101']
        ];

        for ($j = 0; $j < 10; $j++) {
            $photos = [];
            $directory = storage_path('app/public/rentalhomes');

            if (!file_exists($directory)) {
                mkdir($directory, 0755, true);
            }

            for ($i = 0; $i < 3; $i++) {
                $photos[] = "https://picsum.photos/1280/720?random=" . rand(1, 1000);
            }

            $user = User::first();
            if (!$user) {
                $user = User::create([
                    'name' => 'Test User',
                    'email' => 'test@example.com',
                    'password' => Hash::make('password'),
                ]);
            }
            $posterId = $user->id;
            $posterName = $user->name;

            $locationData = $realCities[$j % count($realCities)];

            $dummyData = [
                'property_type' => $faker->randomElement(['Single family Home', 'Apartment', 'Condo', 'Basement Apartment']),
                'available_from' => $faker->date,
                'area' => $faker->randomFloat(2, 500, 5000),
                'deposit_rent' => $faker->randomFloat(2, 1000, 10000),
                'bhk' => $faker->randomElement(['1 Bed 1 Bath', '2 Bed 2 Bath', '2 Bed 1 Bath', '3 Bed 3 Bath', '3 Bed 2 Bath', '4 Bed 4 Bath', '4 Bed 3 Bath', '4 Bed 2 Bath']),
                'address' => $faker->streetAddress . ', ' . $locationData['city'],
                'community_name' => $faker->company . ' Residences',
                'amenities' => $faker->randomElements(['Gym', 'Swimming Pool', 'Club House'], $faker->numberBetween(1, 3)),
                'pets' => $faker->boolean,
                'images' => $photos,
                'accommodates' => $faker->numberBetween(1, 10),
                'location_state' => $locationData['state'],
                'location_city' => $locationData['city'],
                'location_zipcode' => $locationData['zip'],
                'smoking' => $faker->randomElement(['Ok', 'Not okay']),
                'owner_id' => $posterId,
                'owner_name' => $posterName,
                'description' => $faker->paragraphs(2, true),
            ];

            // Sync coordinates for dummy data
            $coords = \DB::table('usa_zipcodes')->where('zip', $locationData['zip'])->first();
            if ($coords) {
                $dummyData['latitude'] = $coords->lat;
                $dummyData['longitude'] = $coords->lng;
            }

            $insertedHomes[] = RentalHome::create($dummyData);
        }

        return response()->json([
            'message' => '10 dummy rental homes with real cities added successfully',
            'data' => $insertedHomes
        ], 201);
    }


    /**
     * @OA\Post(
     *     path="/api/rentalhomes",
     *     summary="Create a new rental home",
     *     tags={"RentalHomes"},
     *     security={{"bearerAuth":{}}},
     *     security={{"apiAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"property_type", "available_from", "bhk", "address", "smoking"},
     *             @OA\Property(property="property_type", type="string", example="Apartment"),
     *             @OA\Property(property="available_from", type="string", format="date", example="2024-11-01"),
     *             @OA\Property(property="area", type="number", format="decimal", example=850.5),
     *             @OA\Property(property="deposit_rent", type="number", format="decimal", example=1500.00),
     *             @OA\Property(property="bhk", type="string", example="2 Bed 2 Bath"),
     *             @OA\Property(property="address", type="string", example="123 Main St"),
     *             @OA\Property(property="community_name", type="string", example="Sunset Valley"),
     *             @OA\Property(property="amenities", type="array", @OA\Items(type="string"), example={"Gym", "Club House"}),
     *             @OA\Property(property="pets", type="boolean", example=true),
     *             @OA\Property(property="images", type="array", @OA\Items(type="string"), example={"house1.jpg", "house2.jpg"}),
     *             @OA\Property(property="accommodates", type="integer", example=4),
     *             @OA\Property(property="location_state", type="string", example="California"),
     *             @OA\Property(property="location_city", type="string", example="Los Angeles"),
     *             @OA\Property(property="location_zipcode", type="string", example="90001"),
     *             @OA\Property(property="smoking", type="string", example="Not okay"),
     *             @OA\Property(property="owner_id", type="integer", example=1),
     *             @OA\Property(property="owner_name", type="string", example="John Doe"),
     *             @OA\Property(property="description", type="string", example="Description of the ad")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Rental home created successfully")
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'property_type' => 'required|in:Single family Home,Apartment,Condo,Basement Apartment',
            'available_from' => 'required|date',
            'area' => 'nullable|numeric',
            'deposit_rent' => 'nullable|numeric',
            'bhk' => 'required|in:1 Bed 1 Bath,2 Bed 2 Bath,2 Bed 1 Bath,3 Bed 3 Bath,3 Bed 2 Bath,4 Bed 4 Bath,4 Bed 3 Bath,4 Bed 2 Bath',
            'address' => 'required|string|max:255',
            'community_name' => 'nullable|string|max:255',
            'amenities' => 'nullable|array',
            'amenities.*' => 'nullable|string',
            'pets' => 'nullable|boolean',
            'location_state' => 'nullable|string|max:100',
            'location_city' => 'nullable|string|max:100',
            'location_zipcode' => 'nullable|string|max:20',
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
            'accommodates' => 'nullable|integer',
            'smoking' => 'required|in:Ok,Not okay',
            'owner_id' => 'nullable|exists:users,id',
            'description' => 'nullable|string|max:1000',
            'contact_no' => ['nullable', 'string', 'max:20', 'regex:/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/'],
        ]);

        $receiver = User::find($request->owner_id);
        if (!$receiver) {
            return response()->json(['error' => 'User not found'], 404);
        }
        $data = $request->except('images'); // get all fields except images
        $data['owner_name'] = $receiver->name;
        $data['status'] = 'active';

        // Sync coordinates
        if ($request->filled('location_zipcode')) {
            $coords = \DB::table('usa_zipcodes')->where('zip', $request->location_zipcode)->first();
            if ($coords) {
                $data['latitude'] = $coords->lat;
                $data['longitude'] = $coords->lng;
            }
        }

        if ($request->has('images') && !empty($request->images)) {
            $photos = [];
            
            foreach ($request->images as $base64Image) {
                // Get the file extension
                preg_match('/data:image\/(.*);base64/', $base64Image, $matches);
                $extension = $matches[1];  // e.g., 'jpeg', 'png'
                
                // Decode the base64 string
                $imageData = base64_decode(preg_replace('/^data:image\/\w+;base64,/', '', $base64Image));
                
                // Generate a unique filename for the image
                $filename = uniqid() . '.' . $extension;
                
                // Ensure the directory exists
                $directory = storage_path('app/public/rentalhomes');
                if (!file_exists($directory)) {
                    mkdir($directory, 0755, true);
                }

                // Store the file in the storage directory
                $path = $directory . '/' . $filename; // Full path
                
                // Write the decoded data to the file
                file_put_contents($path, $imageData);
                
                // Add the file path (relative to public storage) to the array
                $photos[] = 'storage/rentalhomes/' . $filename;
            }
            
            // Store the photos array directly (Eloqent casts will handle JSON encoding)
            $data['images'] = $photos;
        }

        $rentalHome = RentalHome::create($data);
        return response()->json(['message' => 'Rental home added successfully', 'data' => $rentalHome], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/rentalhomes/{id}",
     *     summary="Get details of a specific rental home",
     *     tags={"RentalHomes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Rental Home ID", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Rental home details")
     * )
     */
    public function show($id)
    {
        $rentalHome = RentalHome::find($id);

        if (!$rentalHome) {
            return response()->json(['message' => 'Rental home not found'], 404);
        }
        // Guard: model casts images to array already; only decode if still a string
        if (!empty($rentalHome->images) && is_string($rentalHome->images)) {
            $rentalHome->images = json_decode($rentalHome->images, true);
        }
        return response()->json($rentalHome);
    }


    /**
     * @OA\Post(
     *     path="/api/rentalhomes/search",
     *     summary="Search for Rental homes based on filters",
     *     tags={"RentalHomes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="city", type="string", example="Los Angeles"),
     *             @OA\Property(property="state", type="string", example="California"),
     *             @OA\Property(property="zipcode", type="string", example="90001"),
     *             @OA\Property(property="priceMin", type="number", format="float", example=500),
     *             @OA\Property(property="priceMax", type="number", format="float", example=1500),
     *             @OA\Property(
     *                   property="rentalHomeType",
     *                   type="array",
     *                   @OA\Items(type="string", example="Apartment"),
     *                   example={"Condo", "Apartment", "Basement Apartment"}
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful search",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/RentalHome")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No Rental Homes found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="No Rental home found")
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
        // return response()->json($request->all());
        // Validate the request
        $validator = Validator::make($request->all(), [
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'zipcode' => 'nullable|string|max:20',
            'priceMin' => 'nullable|numeric|min:0',
            'priceMax' => 'nullable|numeric|gte:priceMin',
            'rentalHomeType' => 'nullable|array',
            'rentalHomeType.*' => 'string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }



        $query = RentalHome::query()->where('status', 'active');
        // return response()->json(['debug_request' => $request->all()]);

        $city = trim($request->city);
        $state = trim($request->state);
        $zipcode = trim($request->zipcode);
        $radius = 70; // Miles

        $centerPoint = null;

        // Try to get coordinates for the search center
        if ($zipcode) {
            $centerPoint = \DB::table('usa_zipcodes')->where('zip', $zipcode)->first();
        } elseif ($city) {
            $centerPoint = \DB::table('usa_zipcodes')
                ->where('city', 'like', '%' . $city . '%')
                ->when($state, function ($q) use ($state) {
                    return $q->where('state_id', $state)->orWhere('state_name', $state);
                })
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
                if ($request->filled('state')) {
                    $q->orWhere('location_state', 'like', '%' . $request->state . '%');
                }
                if ($request->filled('zipcode')) {
                    $q->orWhere('location_zipcode', 'like', '%' . $request->zipcode . '%');
                }
            });
        }

        if ($request->filled('priceMin')) {
            $query->where('deposit_rent', '>=', $request->priceMin);
        }
        if ($request->filled('priceMax')) {
            $query->where('deposit_rent', '<=', $request->priceMax);
        }

        if ($request->filled('rentalHomeType') && is_array($request->rentalHomeType) && count($request->rentalHomeType) > 0) {
            $mappedTypes = [];
            foreach ($request->rentalHomeType as $type) {
                if (strcasecmp($type, 'Condominium') === 0 || strcasecmp($type, 'Condo') === 0) {
                    $mappedTypes[] = 'Condo';
                } elseif (strcasecmp($type, 'Single Family') === 0 || strcasecmp($type, 'Single family Home') === 0) {
                    $mappedTypes[] = 'Single family Home';
                } elseif (strcasecmp($type, 'Basement') === 0 || strcasecmp($type, 'Basement Apartment') === 0) {
                    $mappedTypes[] = 'Basement Apartment';
                } elseif (strcasecmp($type, 'Apartment') === 0) {
                    $mappedTypes[] = 'Apartment';
                } else {
                    $mappedTypes[] = $type;
                }
            }
            $query->whereIn('property_type', $mappedTypes);
        }

        // Sorting
        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'price-asc':
                    $query->orderBy('deposit_rent', 'asc');
                    break;
                case 'price-desc':
                    $query->orderBy('deposit_rent', 'desc');
                    break;
                case 'created_at-desc':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'area-desc':
                    $query->orderBy('area', 'desc');
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
                    break;
            }
        } else {
             $query->orderBy('created_at', 'desc');
        }



        $perPage = 15;
        $rentalhomes = $query->paginate($perPage);

        // Automatically decode JSON-encoded 'photos' field to an array
        $rentalhomes->getCollection()->transform(function ($rentalhome) {
            if (is_string($rentalhome->images) && !empty($rentalhome->images)) {
                $rentalhome->images = json_decode($rentalhome->images, true);
            }
            return $rentalhome;
        });

        return response()->json($rentalhomes);
    }

    /**
     * @OA\Put(
     *     path="/api/rentalhomes/{id}",
     *     summary="Update an existing rental home",
     *     tags={"RentalHomes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Rental Home ID", @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/RentalHome")
     *     ),
     *     @OA\Response(response=200, description="Rental home updated successfully")
     * )
     */
    public function update(Request $request, $id)
    {
        $rentalHome = RentalHome::find($id);

        if (!$rentalHome) {
            return response()->json(['message' => 'Rental home not found'], 404);
        }

        $request->validate([
            'property_type' => 'sometimes|in:Single family Home,Apartment,Condo,Basement Apartment',
            'available_from' => 'sometimes|date',
            'area' => 'nullable|numeric',
            'deposit_rent' => 'nullable|numeric',
            'bhk' => 'sometimes|in:1 Bed 1 Bath,2 Bed 2 Bath,2 Bed 1 Bath,3 Bed 3 Bath,3 Bed 2 Bath,4 Bed 4 Bath,4 Bed 3 Bath,4 Bed 2 Bath',
            'address' => 'sometimes|string|max:255',
            'status' => 'nullable|in:active,inactive',
            'community_name' => 'nullable|string|max:255',
            'amenities' => 'nullable|array',
            'amenities.*' => 'nullable|string',
            'pets' => 'nullable|boolean',
            'newPhotos.*' => ['nullable', 'string', function ($attribute, $value, $fail) {
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
            'accommodates' => 'nullable|integer',
            'smoking' => 'sometimes|in:Ok,Not okay',
            'owner_id' => 'nullable|exists:users,id',
            'description' => 'nullable|string|max:1000',
            'contact_no' => ['nullable', 'string', 'max:20', 'regex:/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/'],
        ]);
        
        $data = $request->except(['images', 'newPhotos', 'existingPhotos']);
        
        if ($request->has('owner_id')) {
            $receiver = User::find($request->owner_id);
            if (!$receiver) {
                return response()->json(['error' => 'User not found'], 404);
            }
            $data['owner_name'] = $receiver->name;
        }

        // Sync coordinates
        if ($request->filled('location_zipcode')) {
            $coords = \DB::table('usa_zipcodes')->where('zip', $request->location_zipcode)->first();
            if ($coords) {
                $data['latitude'] = $coords->lat;
                $data['longitude'] = $coords->lng;
            }
        }

        // Initialize to empty array to prevent array_merge crash when no existing photos sent
        $existingPhotos = [];
        if ($request->has('existingPhotos') && !empty($request->existingPhotos)) {
            $existingPhotos = is_array($request->existingPhotos) ? $request->existingPhotos : json_decode($request->existingPhotos, true) ?? [];
        }

        $photos = [];
        if ($request->has('newPhotos') && !empty($request->newPhotos)) {
            foreach ($request->newPhotos as $base64Image) {
                preg_match('/data:image\/(.*);base64/', $base64Image, $matches);
                $extension = $matches[1];

                $imageData = base64_decode(preg_replace('/^data:image\/\w+;base64,/', '', $base64Image));

                $filename = uniqid() . '.' . $extension;

                $directory = storage_path('app/public/rentalhomes');
                if (!file_exists($directory)) {
                    mkdir($directory, 0755, true);
                }

                $path = $directory . '/' . $filename;

                file_put_contents($path, $imageData);

                $photos[] = 'storage/rentalhomes/' . $filename;
            }
            // $data['images'] = json_encode($photos);
        }

        $allPhotos = array_merge($photos, $existingPhotos);
        $data['images'] = $allPhotos;
        $rentalHome->update($data);

        // $updated = $rentalHome->update($data);

        // if($rentalHome->fill($data)->isDirty()) {
        //     $changedFields = $rentalHome->getDirty(); // returns array of changed fields and new values
    
        //     // Log::info('Rental Home fields updated:', [
        //     //     'rental_home_id' => $rentalHome->id,
        //     //     'changed_fields' => $changedFields,
        //     // ]);

        //     $rentalHome->save();
        // }
        // if ($updated) {
        //     print_r($updated);
        // } else {
        //     print_r($updated);
        // }

        // Note: $rentalHome->images is already an array due to the 'array' cast in the model
        // json_decode on an array would throw a TypeError — removed that line

        return response()->json(['message' => 'Rental home updated successfully', 'data' => $rentalHome]);
    }

    /**
     * @OA\Delete(
     *     path="/api/rentalhomes/{id}",
     *     summary="Delete a rental home",
     *     tags={"RentalHomes"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Rental Home ID", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Rental home deleted successfully")
     * )
     */
    public function destroy($id)
    {
        $rentalHome = RentalHome::find($id);

        if (!$rentalHome) {
            return response()->json(['message' => 'Rental home not found'], 404);
        }

        $rentalHome->delete();

        return response()->json(['message' => 'Rental home deleted successfully']);
    }

    public function getMyAdCount(Request $request)
    {
        $count = \App\Models\RentalHome::where('owner_id', $request->user()->id)->count();
        return response()->json(['count' => $count]);
    }

    public function getMyListings(Request $request)
    {
        $listings = \App\Models\RentalHome::where('owner_id', $request->user()->id)->get();
        return response()->json($listings);
    }
}
