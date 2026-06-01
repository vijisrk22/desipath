<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BuySellCar;
use App\Models\CarFuelType;
use App\Models\CarTransmission;
use App\Models\CarCondition;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use OpenApi\Annotations as OA;
use Faker\Factory as Faker;
use App\Models\User;
use App\Models\CarMakeModel;


/**
 * @OA\Info(
 *     title="DESIPATH API Documentation",
 *     version="1.0",
 *     description="SWAGGER API for DESIPATH Application"
 * )
 * @OA\Server(
 *     url="http://localhost:8000",
 *     description="Desipath Development Server"
 * )
 */
class CarController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/cars",
     *     summary="Get list of cars",
     *     tags={"Cars"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="List of cars")
     * )
     */
    public function adminIndex(Request $request)
    {
        $query = BuySellCar::query();

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('make', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%")
                  ->orWhere('seller_name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $results = $query->orderBy('created_at', 'desc')->paginate(20);

        $results->getCollection()->transform(function ($item) {
            if (is_string($item->pictures) && !empty($item->pictures)) {
                $item->pictures = json_decode($item->pictures, true);
            }
            return $item;
        });

        return response()->json($results);
    }

    public function adminToggleStatus(Request $request, $id)
    {
        $item = BuySellCar::findOrFail($id);
        $item->status = ($item->status === 'active' || $item->status === 'approved') ? 'pending' : 'active';
        $item->save();
        return response()->json(['success' => true, 'status' => $item->status]);
    }

    public function index(Request $request)
    {
        $query = BuySellCar::with(['fuelType','transmission','condition'])->where('status', 'active');

        // Admin search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('make', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%")
                  ->orWhere('seller_name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $buysellcars = $query->paginate(15);

        $buysellcars->getCollection()->transform(function ($c) {
            if (is_string($c->pictures) && !empty($c->pictures)) {
                $c->pictures = json_decode($c->pictures, true);
            }
            $c->fuel_type  = $c->fuelType?->name;
            $c->transmission_name = $c->transmission?->name;
            $c->condition_name = $c->condition?->name;
            return $c;
        });

        return response()->json($buysellcars);
    }

/**
* @OA\Schema(
*     schema="BuySellCars",
*     @OA\Property(property="id", type="integer", example=1, description="Auto-incremented unique identifier for the car listing"),
*     @OA\Property(property="make", type="string", example="Toyota", description="Make of the car"),
*     @OA\Property(property="model", type="string", example="Corolla", description="Model of the car"),
*     @OA\Property(property="year", type="integer", example=2022, description="Manufacturing year of the car"),
*     @OA\Property(property="miles", type="integer", nullable=true, example=12000, description="Mileage of the car in miles (optional)"),
*     @OA\Property(property="variant", type="string", nullable=true, example="LE", description="Variant of the car model (optional)"),
*     @OA\Property(
*         property="pictures",
*         type="array",
*         @OA\Items(type="string", example="storage/cars/abc123.jpg")
*     ),
*     @OA\Property(property="location", type="string", example="Los Angeles, CA", description="Location of the car"),
*     @OA\Property(property="seller_id", type="integer", nullable=true, example=1, description="Foreign key referencing the `Users` table"),
*     @OA\Property(property="price", type="number", format="decimal", nullable=true, example=15000.00, description="Selling price of the car"),
*     @OA\Property(property="description", type="string", nullable=true, example="Well-maintained car with excellent mileage.", description="Detailed description of the car"),
*     @OA\Property(property="created_at", type="string", format="date-time", nullable=true, example="2024-10-10T14:48:00Z", description="Timestamp when the record was created"),
*     @OA\Property(property="updated_at", type="string", format="date-time", nullable=true, example="2024-10-12T09:30:00Z", description="Timestamp when the record was last updated")
* )
*/
public function testCars() { return BuySellCar::all(); }

    /**
     * @OA\Get(path="/api/cars/attributes", summary="Get car attribute lists", tags={"Cars"}, security={{"bearerAuth":{}}},
     *   @OA\Response(response=200, description="Fuel types, transmissions, conditions")
     * )
     */
    public function getCarAttributes()
    {
        return response()->json([
            'fuel_types'    => CarFuelType::orderBy('id')->get(['id','name']),
            'transmissions' => CarTransmission::orderBy('id')->get(['id','name']),
            'conditions'    => CarCondition::orderBy('id')->get(['id','name']),
        ]);
    }




    /**
     * @OA\Post(
     *     path="/api/cars/dummy-insert",
     *     summary="Insert a dummy cars",
     *     tags={"Cars"},
     *     security={{"bearerAuth":{}}}, 
     *     @OA\Response(response=201, description="Dummy cars added successfully")
     * )
     */
    public function dummyInsert(Request $request)
    {
        $faker = Faker::create();
        $insertedCars = [];

        $realCities = [
            ['city' => 'New York', 'state' => 'NY', 'zip' => '10001'],
            ['city' => 'Los Angeles', 'state' => 'CA', 'zip' => '90001'],
            ['city' => 'Chicago', 'state' => 'IL', 'zip' => '60601'],
            ['city' => 'Houston', 'state' => 'TX', 'zip' => '77001'],
            ['city' => 'Phoenix', 'state' => 'AZ', 'zip' => '85001'],
            ['city' => 'Philadelphia', 'state' => 'PA', 'zip' => '19101'],
            ['city' => 'San Antonio', 'state' => 'TX', 'zip' => '78201'],
            ['city' => 'San Diego', 'state' => 'CA', 'zip' => '92101'],
            ['city' => 'Dallas', 'state' => 'TX', 'zip' => '75201'],
            ['city' => 'San Jose', 'state' => 'CA', 'zip' => '95101']
        ];

        $carDetails = [
            ['make' => 'Toyota', 'model' => 'Camry'],
            ['make' => 'Honda', 'model' => 'Civic'],
            ['make' => 'Ford', 'model' => 'F-150'],
            ['make' => 'Tesla', 'model' => 'Model 3'],
            ['make' => 'BMW', 'model' => 'X5'],
            ['make' => 'Chevrolet', 'model' => 'Silverado'],
            ['make' => 'Nissan', 'model' => 'Altima'],
            ['make' => 'Hyundai', 'model' => 'Elantra'],
            ['make' => 'Lexus', 'model' => 'RX 350'],
            ['make' => 'Audi', 'model' => 'A4']
        ];

        for ($j = 0; $j < 10; $j++) {
            $photos = [];
            $directory = storage_path('app/public/cars');

            if (!file_exists($directory)) {
                mkdir($directory, 0755, true);
            }

            for ($i = 0; $i < 3; $i++) {
                $photos[] = "https://placehold.co/640x480?text=Car+" . ($j + 1);
            }

            $user = User::first();
            if (!$user) {
                $user = User::create([
                    'name' => 'Auto Seller',
                    'email' => 'seller@example.com',
                    'password' => Hash::make('password'),
                ]);
            }
            $posterId = $user->id;
            $posterName = $user->name;

            $location = $realCities[$j % count($realCities)];
            $car = $carDetails[$j % count($carDetails)];

            $dummyData = [
                'make' => $car['make'],
                'model' => $car['model'],
                'year' => $faker->numberBetween(2015, 2024),
                'miles' => $faker->numberBetween(1000, 100000),
                'variant' => $faker->randomElement(['Standard', 'Luxury', 'Sport', 'Electric']),
                'pictures' => $photos, // Model cast handles JSON
                'location' => $location['city'] . ', ' . $location['state'],
                'seller_id' => $posterId,
                'price' => $faker->randomFloat(2, 15000, 60000),
                'description' => $faker->sentence(15),
                'seller_name' => $posterName,
            ];

            $insertedCars[] = BuySellCar::create($dummyData);
        }

        return response()->json([
            'message' => '10 dummy cars with real cities added successfully',
            'data' => $insertedCars
        ], 201);
    }

    /**
     * @OA\Post(
     *     path="/api/cars",
     *     summary="Create a new car",
     *     tags={"Cars"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"make", "model", "year", "miles", "variant", "pictures", "location", "price"},
     *             @OA\Property(property="make", type="string", example="Toyota"),
     *             @OA\Property(property="model", type="string", example="Camry"),
     *             @OA\Property(property="year", type="integer", example=2022),
     *             @OA\Property(property="miles", type="integer", example=12000),
     *             @OA\Property(property="variant", type="string", example="LE"),
     *             @OA\Property(property="pictures", type="array", @OA\Items(type="string", example="car.jpg")),
     *             @OA\Property(property="location", type="string", example="Los Angeles, CA"),
     *             @OA\Property(property="price", type="number", format="float", example=25000),
     *             @OA\Property(property="description", type="string", example="Well-maintained car"),
     *             @OA\Property(property="seller_id", type="integer", example=2),
     *             @OA\Property(property="seller_name", type="string", example="Foo Doo")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Car created successfully"),
     *     @OA\Response(
    *         response=422,
    *         description="Validation error",
    *         @OA\JsonContent(
    *             @OA\Property(property="message", type="string", example="The given data was invalid."),
    *             @OA\Property(
    *                 property="errors",
    *                 type="object",
    *                 @OA\AdditionalProperties(type="array", @OA\Items(type="string"))
    *             )
    *         )
    *     )
    * )
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'make'            => 'required|string|max:255',
            'model'           => 'required|string|max:255',
            'year'            => 'required|integer',
            'miles'           => 'nullable|integer',
            'fuel_type_id'    => 'nullable|exists:car_fuel_types,id',
            'transmission_id' => 'nullable|exists:car_transmissions,id',
            'condition_id'    => 'nullable|exists:car_conditions,id',
            'pictures.*'      => ['nullable', 'string', function ($attribute, $value, $fail) {
                if (!preg_match('/^data:image\/\w+;base64,/', $value)) {
                    $fail('The ' . $attribute . ' must be a valid base64 encoded image.');
                }
                $imageData = substr($value, strpos($value, ',') + 1);
                $imageData = base64_decode($imageData);
                if (strlen($imageData) > 2 * 1024 * 1024) {
                    $fail('The ' . $attribute . ' must be less than 2MB.');
                }
            }],
            'location'              => 'required|string|max:255',
            'price'                 => 'required|numeric',
            'description'           => 'nullable|string|max:1000',
            'seller_id'             => 'nullable|exists:users,id',
            'is_dealer'             => 'required|boolean',
            'dealer_name'           => 'required_if:is_dealer,true|nullable|string|max:255',
            'dealer_zipcode'        => 'required_if:is_dealer,true|nullable|string|max:10',
            'dealer_contact_person' => 'required_if:is_dealer,true|nullable|string|max:255',
            'dealer_contact_number' => 'required_if:is_dealer,true|nullable|string|max:20',
            'dealer_email'          => 'required_if:is_dealer,true|nullable|email|max:255',
            'owner_name'            => 'required_if:is_dealer,false|nullable|string|max:255',
            'owner_contact_number'  => 'required_if:is_dealer,false|nullable|string|max:20',
            'drive_type'            => 'nullable|string|max:255',
            'mpg'                   => 'nullable|string|max:255',
            'vin'                   => 'nullable|string|max:255',
            'features'              => 'nullable|array',
        ]);

        $receiver = User::find($request->seller_id);
        if (!$receiver) {
            return response()->json(['error' => 'User not found'], 404);
        }
        $data = $request->except('pictures');
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

        if ($request->has('pictures') && !empty($request->pictures)) {
            $photos = [];
            foreach ($request->pictures as $base64Image) {
                preg_match('/data:image\/(.*);base64/', $base64Image, $matches);
                $extension = $matches[1];
                $imageData = base64_decode(preg_replace('/^data:image\/\w+;base64,/', '', $base64Image));
                $filename  = uniqid() . '.' . $extension;
                $directory = storage_path('app/public/cars');
                if (!file_exists($directory)) { mkdir($directory, 0755, true); }
                file_put_contents($directory . '/' . $filename, $imageData);
                $photos[] = 'storage/cars/' . $filename;
            }
            $data['pictures'] = $photos;
        }
        $car = BuySellCar::create($data);
        return response()->json(['message' => 'Car added successfully', 'data' => $car], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/cars/{id}",
     *     summary="Get details of a specific car",
     *     tags={"Cars"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Car ID", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Car details")
     * )
     */
    public function show($id)
    {
        $car = BuySellCar::with(['fuelType','transmission','condition'])->find($id);
        if (!$car) {
            return response()->json(['message' => 'Car not found'], 404);
        }
        if (!empty($car->pictures) && is_string($car->pictures)) {
            $car->pictures = json_decode($car->pictures, true);
        }
        $car->fuel_type_name      = $car->fuelType?->name;
        $car->transmission_name   = $car->transmission?->name;
        $car->condition_name      = $car->condition?->name;
        return response()->json($car);
    }


    /**
     * @OA\Post(
     *     path="/api/cars/search",
     *     summary="Search for cars based on filters",
     *     tags={"Cars"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="carMake", type="string", example="Toyota"),
     *             @OA\Property(property="Location", type="string", example="Los Angeles"),
     *             @OA\Property(property="priceMin", type="number", format="float", example=5000),
     *             @OA\Property(property="priceMax", type="number", format="float", example=15000)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful search",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/BuySellCars")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No cars found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="No cars found")
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
        // Debug logging to workspace
        $logFile = storage_path('logs/car_search_debug.log');
        $logData = [
            'timestamp' => date('Y-m-d H:i:s'),
            'ip' => $request->ip(),
            'params' => $request->all()
        ];
        file_put_contents($logFile, json_encode($logData) . "\n", FILE_APPEND);

        // Validation
        $validator = Validator::make($request->all(), [
            'carMake' => 'nullable|string|max:100',
            'carModel' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'zipcode' => 'nullable|string|max:20',
            'priceMin' => 'nullable|numeric|min:0',
            'priceMax' => 'nullable|numeric|gte:priceMin',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = BuySellCar::with(['fuelType','transmission','condition'])->where('status', 'active');

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

            $query->whereBetween('latitude', [$lat - $latRange, $lat + $latRange])
                  ->whereBetween('longitude', [$lng - $lngRange, $lng + $lngRange]);

            $query->select('*')
                ->selectRaw("(3959 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance", [$lat, $lng, $lat])
                ->having('distance', '<=', $radius);
            
            // Priority ordering: exact zip first, then by distance
            $query->orderByRaw("CASE WHEN location_zipcode = ? THEN 0 ELSE 1 END ASC", [$searchZip])
                  ->orderBy('distance', 'asc');
        } else {
            // Fallback to basic keyword matching if no coordinates found
            if ($request->filled('city')) {
                $query->where('location_city', 'like', '%' . $request->city . '%');
            }
            if ($request->filled('state')) {
                $query->where('location_state', 'like', '%' . $request->state . '%');
            }
            if ($request->filled('zipcode')) {
                $query->where('location_zipcode', 'like', '%' . $request->zipcode . '%');
            }
            // Compatibility for old location field search
            if ($request->filled('location')) {
                $query->where('location', 'like', '%' . $request->location . '%');
            }
        }

        if ($request->filled('carMake')) {
            $query->where('make', 'like', '%' . $request->input('carMake') . '%');
        }
        if ($request->filled('carModel')) {
            $query->where('model', 'like', '%' . $request->input('carModel') . '%');
        }
        if ($request->filled('priceMin')) {
            $query->where('price', '>=', $request->input('priceMin'));
        }
        if ($request->filled('priceMax')) {
            $query->where('price', '<=', $request->input('priceMax'));
        }

        $cars = $query->get();

        // Decode pictures JSON field if needed
        $cars->transform(function ($car) {
            if (is_string($car->pictures) && !empty($car->pictures)) {
                $car->pictures = json_decode($car->pictures, true);
            }
            $car->fuel_type  = $car->fuelType?->name;
            $car->transmission_name = $car->transmission?->name;
            $car->condition_name = $car->condition?->name;
            return $car;
        });

        return response()->json($cars);
    }



    /**
     * @OA\Put(
     *     path="/api/cars/{id}",
     *     summary="Update an existing car",
     *     tags={"Cars"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Car ID", @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"make", "model", "year", "location", "price"},
     *             @OA\Property(property="make", type="string", example="Toyota"),
     *             @OA\Property(property="model", type="string", example="Corolla"),
     *             @OA\Property(property="year", type="integer", example=2020),
     *             @OA\Property(property="miles", type="integer", example=15000),
     *             @OA\Property(property="variant", type="string", example="SE"),
     *     @OA\Property(
     *         property="pictures",
     *         type="array",
     *         @OA\Items(type="string", example="car_updated.jpg"),
     *         description="Array of image file names or URLs for the car"
     *     ),
     *             @OA\Property(property="location", type="string", example="San Diego, CA"),
     *             @OA\Property(property="price", type="number", format="float", example=20000),
     *             @OA\Property(property="description", type="string", example="Lightly used car"),
     *             @OA\Property(property="seller_id", type="integer", example=2),
     *             @OA\Property(property="seller_name", type="string", example="Foo Doo")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Car updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Car updated successfully"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Car not found"
     *     ),
     *      @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        $car = BuySellCar::find($id);

        if (!$car) {
            return response()->json(['message' => 'Car not found'], 404);
        }

        $validatedData = $request->validate([
            'make' => 'sometimes|string|max:255',
            'model' => 'sometimes|string|max:255',
            'year' => 'sometimes|integer',
            'status' => 'nullable|in:active,inactive',
            'miles' => 'nullable|integer',
            'variant' => 'nullable|string|max:255',
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
            'location' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric',
            'description' => 'nullable|string|max:1000',
            'seller_id' => 'nullable|exists:users,id',
            'seller_name' => 'nullable|string|max:255',
        ]);

        $data = $request->except(['pictures', 'newPhotos', 'existingPhotos', 'new_pictures', 'existing_pictures']);
        
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

        $existingPhotos = $request->input('existingPhotos', $request->input('existing_pictures', []));
        $photos = [];
        $newPhotosData = $request->input('newPhotos', $request->input('pictures', []));
        if (!empty($newPhotosData)) {
            foreach ($newPhotosData as $base64Image) {
                preg_match('/data:image\/(.*);base64/', $base64Image, $matches);
                $extension = $matches[1];

                $imageData = base64_decode(preg_replace('/^data:image\/\w+;base64,/', '', $base64Image));

                $filename = uniqid() . '.' . $extension;

                $directory = storage_path('app/public/cars');
                if (!file_exists($directory)) {
                    mkdir($directory, 0755, true);
                }

                $path = $directory . '/' . $filename;

                file_put_contents($path, $imageData);

                $photos[] = 'storage/cars/' . $filename;
            }

            // $data['pictures'] = json_encode($photos);
        }

        $allPhotos = array_merge($photos, $existingPhotos);
        $data['pictures'] = $allPhotos;
        $car->update($data);

        // Return photos as array in response
        if (is_string($car->pictures)) {
            $car->pictures = json_decode($car->pictures, true);
        }

        return response()->json([
            'message' => 'Car updated successfully',
            'data' => $car
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/cars/{id}",
     *     summary="Delete a car",
     *     tags={"Cars"},
    *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Car ID", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Car deleted successfully")
     * )
     */
    public function destroy($id)
    {
        $car = BuySellCar::find($id);

        if (!$car) {
            return response()->json(['message' => 'Car not found'], 404);
        }

        $car->delete();

        return response()->json(['message' => 'Car deleted successfully']);
    }


    /**
     * @OA\Get(
     *     path="/api/cars/make",
     *     summary="Get list of Makes",
     *     description="Fetch all distinct car makes as a list of strings",
     *     operationId="getMakes",
     *     tags={"Cars"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of car makes",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(type="string", example="Acura")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No makes found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function getcarmakes()
    {
        $makes = CarMakeModel::select('make')
                    ->distinct()
                    ->orderBy('make')
                    ->pluck('make') // returns a collection of strings
                    ->toArray();    // converts to a plain array

        if (empty($makes)) {
            return response()->json([
            'error' => 'No makes found.'
            ], 404);
        }
        return response()->json($makes);
    }
    
    /**
     * @OA\Get(
     *     path="/api/cars/models",
     *     summary="Get car models by make",
     *     description="Fetch all car models for a given make",
     *     operationId="getCarModels",
     *     tags={"Cars"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="make",
     *         in="query",
     *         required=true,
     *         description="Car make to filter models",
     *         @OA\Schema(type="string", example="Toyota")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of car models",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer", description="Model record ID"),
     *                 @OA\Property(property="make", type="string", description="Car make"),
     *                 @OA\Property(property="model", type="string", description="Car model"),
     *                 @OA\Property(property="created_at", type="string", format="date-time", description="Created timestamp"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", description="Updated timestamp")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Make is required"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No models found for the given make"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function getcarmodels(Request $request)
    {
        $carMake = $request->query('make');
        if (!$carMake) {
            return response()->json([
                'error' => 'Make is required.'
            ], 400);
        }
        $models = CarMakeModel::where('make', $carMake)->get();
        if ($models->isEmpty()) {
            return response()->json([
                'error' => 'No models found for the given make.'
            ], 404);
        }
        return response()->json($models);
    }


    // private function validateRequest($request)
    // {
    //     $request->validate([
    //         'make' => 'required|string|max:255',
    //         'model' => 'required|string|max:255',
    //         'year' => 'required|integer|min:1886|max:' . date('Y'),
    //         'miles' => 'required|integer|min:0',
    //         'variant' => 'required|string|max:255',
    //         'pictures' => 'nullable|string',
    //         'location' => 'required|string|max:255',
    //         'price' => 'required|numeric|min:0',
    //         'description' => 'nullable|string|max:1000'
    //     ]);
    public function getMyAdCount(Request $request)
    {
        $count = \App\Models\BuySellCar::where('seller_id', $request->user()->id)->count();
        return response()->json(['count' => $count]);
    }

    public function getMyListings(Request $request)
    {
        $listings = \App\Models\BuySellCar::where('seller_id', $request->user()->id)->get();
        // Parse pictures if needed
        return response()->json($listings);
    }
}
