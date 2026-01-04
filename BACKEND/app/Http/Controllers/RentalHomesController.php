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
\Illuminate\Support\Facades\DB::enableQueryLog();

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
    public function index(Request $request)
    {
        $perPage = 9;
        $query = RentalHome::query();

        // Sorting
        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'price-asc':
                    $query->orderBy('deposit_rent', 'asc');
                    break;
                case 'price-desc':
                    $query->orderBy('deposit_rent', 'desc');
                    break;
                case 'name-asc':
                    $query->orderBy('address', 'asc'); // Treating address as name for sorting
                    break;
                case 'name-desc':
                    $query->orderBy('address', 'desc');
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

        $photos = [];
        $directory = storage_path('app/public/rentalhomes');

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

            $photos[] = 'storage/rentalhomes/' . $filename;
        }

        $posterId = $faker->numberBetween(2, 4);

        // Fetch the user name from the database using poster_id
        $receiver = User::find($posterId);

        $posterName = $receiver ? $receiver->name : 'Unknown User';

        $dummyData = [
            'property_type' => $faker->randomElement(['Single family Home', 'Apartment', 'Condo', 'Basement Apartment']),
            'available_from' => $faker->date,
            'area' => $faker->randomFloat(2, 500, 5000),
            'deposit_rent' => $faker->randomFloat(2, 1000, 10000),
            'bhk' => $faker->randomElement(['1 Bed 1 Bath', '2 Bed 2 Bath', '2 Bed 1 Bath', '3 Bed 3 Bath', '3 Bed 2 Bath', '4 Bed 4 Bath', '4 Bed 3 Bath', '4 Bed 2 Bath']),
            'address' => $faker->address,
            'community_name' => $faker->word,
            'amenities' => $faker->randomElements(['Gym', 'Swimming Pool', 'Club House'], $faker->numberBetween(1, 3)), // Now an array
            'pets' => $faker->boolean,
            'location' => $faker->city . ', ' . $faker->stateAbbr,
            'images' => json_encode($photos),
            'accommodates' => $faker->numberBetween(1, 10),
            'location_state' => $faker->state,
            'location_city' => $faker->city,
            'location_zipcode' => $faker->postcode,
            'smoking' => $faker->randomElement(['Ok', 'Not okay']),
            'owner_id' => $posterId,
            'owner_name' => $posterName,
            'description' => $faker->text(2000),
        ];

        $rentalHome = RentalHome::create($dummyData);

        return response()->json([
            'message' => 'Dummy rental home added successfully',
            'data' => $rentalHome
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
            'amenities.*' => 'in:Gym,Swimming Pool,Club House',
            'pets' => 'nullable|boolean',
            'location_state' => 'nullable|string|max:100',
            'location_city' => 'nullable|string|max:100',
            'location_zipcode' => 'nullable|string|max:20',
            'images.*' => ['nullable', 'string', function ($attribute, $value, $fail) {
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
            'accommodates' => 'nullable|integer',
            'smoking' => 'required|in:Ok,Not okay',
            'owner_id' => 'nullable|exists:users,id',
            'description' => 'nullable|string|max:1000',
        ]);

        $receiver = User::find($request->owner_id);
        if (!$receiver) {
            return response()->json(['error' => 'User not found'], 404);
        }
        $data = $request->except('images'); // get all fields except images
        $data['owner_name'] = $receiver->name;

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

        $query = RentalHome::query();

        $city = trim($request->city);
        $state = trim($request->state);
        $zipcode = trim($request->zipcode);
        $priceMin = $request->priceMin;
        $priceMax = $request->priceMax;

        $query->where(function ($q) use ($city, $state, $zipcode, $priceMin, $priceMax, $request) {
            $q->where(function ($query) use ($request) {
        // $query->where(function ($q) use ($request) {
                if ($request->filled('city')) {
                    $query->orWhere('location_city', 'like', '%' . $request->city . '%');
                }
                if ($request->filled('state')) {
                    $query->orWhere('location_state', 'like', '%' . $request->state . '%');
                }
                if ($request->filled('zipcode')) {
                    $query->orWhere('location_zipcode', 'like', '%' . $request->zipcode . '%');
                }

                if ($request->filled('priceMin') || $request->filled('priceMax')) {
                    $query->orWhere(function ($subQuery) use ($request) {
                        if ($request->filled('priceMin')) {
                            // $q->orWhere('deposit_rent', '>=', $request->priceMin);
                            $subQuery->where('deposit_rent', '>=', $request->priceMin);
                        }
                        if ($request->filled('priceMax')) {
                            // $q->orWhere('deposit_rent', '<=', $request->priceMax);
                            $subQuery->where('deposit_rent', '<=', $request->priceMax);
                        }
                    });        
                }
                // if ($request->filled('rentalHomeType')) {
                //     $query->orWhere('property_type', 'like', '%' . $request->rentalHomeType . '%');
                // }
                if ($request->filled('rentalHomeType') && is_array($request->rentalHomeType)) {
                    $query->orWhereIn('property_type', $request->rentalHomeType);
                }
            });
        });

        // Sorting
        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'price-asc':
                    $query->orderBy('deposit_rent', 'asc');
                    break;
                case 'price-desc':
                    $query->orderBy('deposit_rent', 'desc');
                    break;
                case 'name-asc':
                    $query->orderBy('address', 'asc');
                    break;
                case 'name-desc':
                    $query->orderBy('address', 'desc');
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
                    break;
            }
        } else {
             $query->orderBy('created_at', 'desc');
        }

        $perPage = 9;
        $rentalhomes = $query->paginate($perPage);

        // Automatically decode JSON-encoded 'photos' field to an array
        $rentalhomes->getCollection()->transform(function ($rentalhome) {
            if (is_string($rentalhome->images) && !empty($rentalhome->images)) {
                $rentalhome->images = json_decode($rentalhome->images, true);
            }
            return $rentalhome;
        });

        if ($rentalhomes->isEmpty()) {
            return response()->json(['message' => 'No rental homes found'], 404);
        }
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
            'community_name' => 'nullable|string|max:255',
            'amenities' => 'nullable|array',
            'amenities.*' => 'in:Gym,Swimming Pool,Club House',
            'pets' => 'nullable|boolean',
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
            'location_state' => 'nullable|string|max:100',
            'location_city' => 'nullable|string|max:100',
            'location_zipcode' => 'nullable|string|max:20',
            'accommodates' => 'nullable|integer',
            'smoking' => 'sometimes|in:Ok,Not okay',
            'owner_id' => 'nullable|exists:users,id',
            'description' => 'nullable|string|max:1000'
        ]);
        
        $receiver = User::find($request->owner_id);
        if (!$receiver) {
            return response()->json(['error' => 'User not found'], 404);
        }
        // $data = $request->except('images');
        $data = $request->except(['images', 'newPhotos', 'existingPhotos']);
        $data['owner_name'] = $receiver->name;

        if ($request->has('existingPhotos') && !empty($request->existingPhotos)) {
            $existingPhotos = $request->existingPhotos;
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

        // Return photos as array in response
        $rentalHome->images = json_decode($rentalHome->images, true);

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
}
