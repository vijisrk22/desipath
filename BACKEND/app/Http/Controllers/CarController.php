<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BuySellCar;
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
    public function index()
    {
        $buysellcars = BuySellCar::all();

        $buysellcars->transform(function ($buysellcar) {
            if (is_string($buysellcar->pictures) && !empty($buysellcar->pictures)) {
                $buysellcar->pictures = json_decode($buysellcar->pictures, true);
            }
            return $buysellcar;
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
public function testCars()
{
    return BuySellCar::all();
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

        $photos = [];
        $directory = storage_path('app/public/cars');

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

            $photos[] = 'storage/cars/' . $filename;
        }

        $posterId = $faker->numberBetween(1, 4);
        // Fetch the user name from the database using poster_id
        $receiver = User::find($posterId);
        $posterName = $receiver ? $receiver->name : 'Unknown User';

        $dummyData = [
            'make' => $faker->company,
            'model' => $faker->word,
            'year' => $faker->year,
            'miles' => $faker->numberBetween(1000, 200000),
            'variant' => $faker->word,
            'pictures' => json_encode($photos),
            'location' => $faker->city . ', ' . $faker->stateAbbr,
            'seller_id' => $posterId,
            'price' => $faker->randomFloat(2, 5000, 50000),
            'description' => $faker->sentence,
            'seller_name' => $posterName,
        ];

        $car = BuySellCar::create($dummyData);

        return response()->json([
            'message' => 'Dummy car added successfully',
            'data' => $car
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
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer',
            'miles' => 'nullable|integer',
            'variant' => 'nullable|string|max:255',
            'pictures.*' => ['nullable', 'string', function ($attribute, $value, $fail) {
                // Check if the value is a valid base64-encoded image
                if (!preg_match('/^data:image\/(jpeg|png|jpg|gif);base64,/', $value)) {
                    $fail('The ' . $attribute . ' must be a valid base64 encoded image.');
                }
                // Validate the decoded image size
                $imageData = substr($value, strpos($value, ',') + 1);
                $imageData = base64_decode($imageData);
                if (strlen($imageData) > 2 * 1024 * 1024) { // 2MB limit
                    $fail('The ' . $attribute . ' must be less than 2MB.');
                }
            }],
            'location' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string|max:1000',
            'seller_id' => 'nullable|exists:users,id'
        ]);
        $receiver = User::find($request->seller_id);
        if (!$receiver) {
            return response()->json(['error' => 'User not found'], 404);
        }
        $data = $request->except('pictures'); // get all fields except photos
        $data['seller_name'] = $receiver->name;

        if ($request->has('pictures') && !empty($request->pictures)) {
            $photos = [];
            
            foreach ($request->pictures as $base64Image) {
                // Get the file extension
                preg_match('/data:image\/(.*);base64/', $base64Image, $matches);
                $extension = $matches[1];  // e.g., 'jpeg', 'png'
                
                // Decode the base64 string
                $imageData = base64_decode(preg_replace('/^data:image\/\w+;base64,/', '', $base64Image));
                
                // Generate a unique filename for the image
                $filename = uniqid() . '.' . $extension;
                
                // Store the file in the storage directory
                $path = storage_path('app/public/cars/' . $filename); // Full path
                
                // Write the decoded data to the file
                file_put_contents($path, $imageData);
                
                // Add the file path (relative to public storage) to the array
                $photos[] = 'storage/cars/' . $filename;
            }
            
            // Store the photos array as JSON in the database
            $data['pictures'] = json_encode($photos);
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
        $car = BuySellCar::find($id);
        if (!$car) {
            return response()->json(['message' => 'Car not found'], 404);
        }
        if (!empty($car->pictures) && is_string($car->pictures)) {
            $car->pictures = json_decode($car->pictures, true);
        }
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
        // Validation
        $validator = Validator::make($request->all(), [
            'Car Make' => 'nullable|string|max:100',
            'Location' => 'nullable|string|max:255',
            'priceMin' => 'nullable|numeric|min:0',
            'priceMax' => 'nullable|numeric|gte:priceMin',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = BuySellCar::query();

        $query->where(function ($q) use ($request) {
            if ($request->filled('Car Make')) {
                $q->orWhere('make', 'like', '%' . $request->input('Car Make') . '%');
            }
            if ($request->filled('Location')) {
                $q->orWhere('location', 'like', '%' . $request->location . '%');
            }
            if ($request->filled('priceMin')) {
                $q->orWhere('price', '>=', $request->priceMin);
            }
            if ($request->filled('priceMax')) {
                $q->orWhere('price', '<=', $request->priceMax);
            }
        });

        // if ($request->filled('Car Make')) {
        //     $query->where('make', 'like', '%' . $request->input('Car Make') . '%');
        // }

        // if ($request->filled('Location')) {
        //     $query->where('location', 'like', '%' . $request->location . '%');
        // }

        // if ($request->filled('priceMin')) {
        //     $query->where('price', '>=', $request->priceMin);
        // }

        // if ($request->filled('priceMax')) {
        //     $query->where('price', '<=', $request->priceMax);
        // }

        $cars = $query->get();

        // Decode pictures JSON field if needed
        $cars->transform(function ($car) {
            if (is_string($car->pictures) && !empty($car->pictures)) {
                $car->pictures = json_decode($car->pictures, true);
            }
            return $car;
        });

        if ($cars->isEmpty()) {
            return response()->json(['message' => 'No cars found'], 404);
        }
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
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer',
            'miles' => 'nullable|integer',
            'variant' => 'nullable|string|max:255',
            'newPhotos.*' => ['nullable', 'string', function ($attribute, $value, $fail) {
                // Check if the value is a valid base64-encoded image
                if (!preg_match('/^data:image\/(jpeg|png|jpg|gif);base64,/', $value)) {
                    $fail('The ' . $attribute . ' must be a valid base64 encoded image.');
                }
                // Validate the decoded image size
                $imageData = substr($value, strpos($value, ',') + 1);
                $imageData = base64_decode($imageData);
                if (strlen($imageData) > 2 * 1024 * 1024) { // 2MB limit
                    $fail('The ' . $attribute . ' must be less than 2MB.');
                }
            }],
            'location' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string|max:1000',
            'seller_id' => 'nullable|exists:users,id',
            'seller_name' => 'nullable|string|max:255',
        ]);

        $receiver = User::find($request->seller_id);
        if (!$receiver) {
            return response()->json(['error' => 'User not found'], 404);
        }
        // $data = $request->except('pictures');
        $data = $request->except(['pictures', 'newPhotos', 'existingPhotos']);
        $data['seller_name'] = $receiver->name;

        if ($request->has('existingPhotos') && !empty($request->existingPhotos)) {
            $existingPhotos = $request->existingPhotos;
        }
        $photos = [];
        if ($request->has('newPhotos') && !empty($request->newPhotos)) {
            // $photos = [];

            foreach ($request->newPhotos as $base64Image) {
                preg_match('/data:image\/(.*);base64/', $base64Image, $matches);
                $extension = $matches[1];

                $imageData = base64_decode(preg_replace('/^data:image\/\w+;base64,/', '', $base64Image));

                $filename = uniqid() . '.' . $extension;

                $path = storage_path('app/public/cars/' . $filename);

                file_put_contents($path, $imageData);

                $photos[] = 'storage/cars/' . $filename;
            }

            // $data['pictures'] = json_encode($photos);
        }

        $allPhotos = array_merge($photos, $existingPhotos);
        $data['pictures'] = json_encode($allPhotos);
        $car->update($data);

        // Return photos as array in response
        $car->pictures = json_decode($car->pictures, true);

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
    // }
}
