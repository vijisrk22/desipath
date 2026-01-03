<?php

namespace App\Http\Controllers;

use App\Models\RoomMate;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

/**
 * @OA\Schema(
 *     schema="RoomMate",
 *     @OA\Property(property="owner", type="boolean", example=true),
 *     @OA\Property(property="agent", type="boolean", example=false),
 *     @OA\Property(property="location_state", type="string", example="California"),
 *     @OA\Property(property="location_city", type="string", example="Los Angeles"),
 *     @OA\Property(property="location_zipcode", type="string", example="90001"),
 *     @OA\Property(property="sharing_type", type="string", enum={"Separate Room", "Share the room with other person"}, example="Separate Room"),
 *     @OA\Property(property="kitchen_available", type="boolean", example=true),
 *     @OA\Property(property="shared_bathroom", type="boolean", example=false),
 *     @OA\Property(property="rent", type="number", format="decimal", example=1200.00),
 *     @OA\Property(property="rent_frequency", type="string", enum={"Monthly", "Daily", "Weekly"}, example="Monthly"),
 *     @OA\Property(property="utilities_included", type="boolean", example=true),
 *     @OA\Property(
 *         property="photos",
 *         type="array",
 *         @OA\Items(type="string", example="storage/roommates/abc123.jpg")
 *     ),
 *     @OA\Property(property="available_from", type="string", format="date", example="2024-11-01"),
 *     @OA\Property(property="available_to", type="string", format="date", example="2024-12-01"),
 *     @OA\Property(property="gender_preference", type="string", enum={"Male", "Female", "Any"}, example="Any"),
 *     @OA\Property(property="car_parking_available", type="boolean", example=true),
 *     @OA\Property(property="food_preference", type="string", enum={"Veg", "Non Veg", "Any"}, example="Any"),
 *     @OA\Property(property="washer_dryer", type="boolean", example=true),
 *     @OA\Property(property="poster_id", type="integer", example=1),
 *     @OA\Property(property="poster_name", type="string", example="John Doe")
 * )
 */
class RoomMatesController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/roommates",
     *     summary="Get list of room mates",
     *     tags={"RoomMates"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="List of room mates")
     * )
     */
     public function start()
    {
        return view('rooms.rooms'); // The path corresponds to resources/views/room-share/index.blade.php
    }

    public function index()
    {
        $roommates = RoomMate::all();

        $roommates->transform(function ($roommate) {
            if (is_string($roommate->photos) && !empty($roommate->photos)) {
                $roommate->photos = json_decode($roommate->photos, true);
            }
            return $roommate;
        });

        return response()->json($roommates);
    }

    /**
     * Dummy Insert API for RoomMate
     *
     * @return \Illuminate\Http\JsonResponse
     */
    /**
     * @OA\Post(
     *     path="/api/roommates/dummy-insert",
     *     summary="Insert a dummy room mates",
     *     tags={"RoomMates"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=201, description="Dummy room mates added successfully")
     * )
     */
    public function dummyInsert()
    {
        $faker = Faker::create();

        $photos = [];
        $directory = storage_path('app/public/roommates');

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

            $photos[] = 'storage/roommates/' . $filename;
        }

        $posterId = $faker->numberBetween(2, 4);

        // Fetch the user name from the database using poster_id
        $receiver = User::find($posterId);

        $posterName = $receiver ? $receiver->name : 'Unknown User';

        $dummyData = [
            'owner' => $faker->boolean,
            'agent' => $faker->boolean,
            'location_state' => $faker->state,
            'location_city' => $faker->city,
            'location_zipcode' => $faker->postcode,
            'sharing_type' => $faker->randomElement(['Separate Room', 'Share the room with other person']),
            'kitchen_available' => $faker->boolean,
            'shared_bathroom' => $faker->boolean,
            'rent' => $faker->randomFloat(2, 500, 5000),
            'rent_frequency' => $faker->randomElement(['Monthly', 'Daily', 'Weekly']),
            'utilities_included' => $faker->boolean,
            'photos' => json_encode($photos),
            'available_from' => $faker->date,
            'available_to' => $faker->date,
            'gender_preference' => $faker->randomElement(['Male', 'Female', 'Any']),
            'car_parking_available' => $faker->boolean,
            'food_preference' => $faker->randomElement(['Veg', 'Non Veg', 'Any']),
            'description' => $faker->text(2000),
            'washer_dryer' => $faker->boolean,
            'poster_id' => $posterId,
            'poster_name' => $posterName,
        ];

        // dd($dummyData);
        $roomMate = RoomMate::create($dummyData);

        return response()->json([
            'message' => 'Dummy room mate added successfully',
            'data' => $roomMate
        ], 201);
    }

    /**
     * @OA\Post(
     *     path="/api/roommates",
     *     summary="Create a new room mate listing",
     *     tags={"RoomMates"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/RoomMate")
     *     ),
     *     @OA\Response(response=201, description="Room mate created successfully")
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'owner' => 'nullable|boolean',
            'agent' => 'nullable|boolean',
            'location_state' => 'nullable|string|max:100',
            'location_city' => 'nullable|string|max:100',
            'location_zipcode' => 'nullable|string|max:20',
            'sharing_type' => 'required|in:Separate Room,Share the room with other person',
            'kitchen_available' => 'nullable|boolean',
            'shared_bathroom' => 'nullable|boolean',
            'rent' => 'nullable|numeric',
            'rent_frequency' => 'nullable|in:Monthly,Daily,Weekly',
            'utilities_included' => 'nullable|boolean',
            'photos.*' => ['nullable', 'string', function ($attribute, $value, $fail) {
                // Check if the value is a valid base64 data URL for an image
                if (!preg_match('/^data:image\/(jpeg|png|jpg|gif);base64,/', $value)) {
                    $fail('The ' . $attribute . ' must be a valid base64 encoded image.');
                }

                // You can further check the file size by decoding the base64 string and checking the length
                $imageData = substr($value, strpos($value, ',') + 1);
                $imageData = base64_decode($imageData);
                if (strlen($imageData) > 2 * 1024 * 1024) { // 2MB limit
                    $fail('The ' . $attribute . ' must be less than 2MB.');
                }
            }],
            'available_from' => 'nullable|date',
            'available_to' => 'nullable|date',
            'gender_preference' => 'nullable|in:Male,Female,Any',
            'car_parking_available' => 'nullable|boolean',
            'food_preference' => 'nullable|in:Veg,Non Veg,Any',
            'washer_dryer' => 'nullable|boolean',
            'description' => 'nullable|string|max:1000',
            'poster_id' => 'nullable|exists:users,id'
        ]);

        $receiver = User::find($request->poster_id);
        if (!$receiver) {
            return response()->json(['error' => 'User not found'], 404);
        }
        $data = $request->except('photos'); // get all fields except photos
        $data['poster_name'] = $receiver->name;

        if ($request->has('photos') && !empty($request->photos)) {
            $photos = [];
            
            foreach ($request->photos as $base64Image) {
                // Get the file extension
                preg_match('/data:image\/(.*);base64/', $base64Image, $matches);
                $extension = $matches[1];  // e.g., 'jpeg', 'png'
                
                // Decode the base64 string
                $imageData = base64_decode(preg_replace('/^data:image\/\w+;base64,/', '', $base64Image));
                
                // Generate a unique filename for the image
                $filename = uniqid() . '.' . $extension;
                
                // Store the file in the storage directory
                $path = storage_path('app/public/roommates/' . $filename); // Full path
                
                // Write the decoded data to the file
                file_put_contents($path, $imageData);
                
                // Add the file path (relative to public storage) to the array
                $photos[] = 'storage/roommates/' . $filename;
            }
            
            // Store the photos array as JSON in the database
            $data['photos'] = json_encode($photos);
        }
        $roomMate = RoomMate::create($data);
        return response()->json(['message' => 'Room mate added successfully', 'data' => $roomMate], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/roommates/{id}",
     *     summary="Get details of a specific room mate",
     *     tags={"RoomMates"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Room Mate ID", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Room mate details")
     * )
     */
    public function show($id)
    {
        $roomMate = RoomMate::find($id);

        if (!$roomMate) {
            return response()->json(['message' => 'Room mate not found'], 404);
        }

        if (!empty($roomMate->photos) && is_string($roomMate->photos)) {
            $roomMate->photos = json_decode($roomMate->photos, true);
        }
        return response()->json($roomMate);
    }

    /**
     * @OA\Post(
     *     path="/api/roommates/search",
     *     summary="Search for roommates based on filters",
     *     tags={"RoomMates"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={},
     *             @OA\Property(property="city", type="string", example="Los Angeles"),
     *             @OA\Property(property="state", type="string", example="California"),
     *             @OA\Property(property="zipcode", type="string", example="90001"),
     *             @OA\Property(property="priceMin", type="number", format="float", example=500),
     *             @OA\Property(property="priceMax", type="number", format="float", example=1500)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful search",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/RoomMate")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No roommates found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="No roommates found")
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
            'state' => 'nullable|string|max:100',
            'zipcode' => 'nullable|string|max:20',
            'priceMin' => 'nullable|numeric|min:0',
            'priceMax' => 'nullable|numeric|gte:priceMin',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = RoomMate::query();

        $city = trim($request->city);
        $state = trim($request->state);
        $zipcode = trim($request->zipcode);
        $priceMin = $request->priceMin;
        $priceMax = $request->priceMax;

        $query->where(function ($q) use ($city, $state, $zipcode, $priceMin, $priceMax, $request) {
            $q->where(function ($query) use ($request) {
                if ($request->filled('city')) {
                    $query->where('location_city', '=', $request->city);
                }
                if ($request->filled('state')) {
                    $query->where('location_state', '=', $request->state);
                }
                if ($request->filled('zipcode')) {
                    $query->where('location_zipcode', '=', $request->zipcode);
                }

                if ($request->filled('priceMin')) {
                    $query->where('rent', '>=', $request->priceMin);
                }

                if ($request->filled('priceMax')) {
                    $query->where('rent', '<=', $request->priceMax);
                }

                // if ($request->filled('priceMin') || $request->filled('priceMax')) {
                //     $query->orWhere(function ($subQuery) use ($request) {
                //         if ($request->filled('priceMin')) {
                //             $subQuery->where('rent', '>=', $request->priceMin);
                //         }
                //         if ($request->filled('priceMax')) {
                //             $subQuery->where('rent', '<=', $request->priceMax);
                //         }
                //     });
                // }
            });
        });

        $roommates = $query->get();
        // dd($roommates);
        // Automatically decode JSON-encoded 'photos' field to an array
        $roommates->transform(function ($roommate) {
            if (is_string($roommate->photos) && !empty($roommate->photos)) {
                $roommate->photos = json_decode($roommate->photos, true);
            }
            return $roommate;
        });

        if ($roommates->isEmpty()) {
            return response()->json(['message' => 'No roommates found'], 404);
        }

        return response()->json($roommates);
    }

    /**
     * @OA\Put(
     *     path="/api/roommates/{id}",
     *     summary="Update an existing room mate",
     *     tags={"RoomMates"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Room Mate ID", @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/RoomMate")
     *     ),
     *     @OA\Response(response=200, description="Room mate updated successfully")
     * )
     */
    public function update(Request $request, $id)
    {
        $roomMate = RoomMate::find($id);

        if (!$roomMate) {
            return response()->json(['message' => 'Room mate not found'], 404);
        }

        $validatedData = $request->validate([
            'owner' => 'nullable|boolean',
            'agent' => 'nullable|boolean',
            'location_state' => 'nullable|string|max:100',
            'location_city' => 'nullable|string|max:100',
            'location_zipcode' => 'nullable|string|max:20',
            'sharing_type' => 'required|in:Separate Room,Share the room with other person',
            'kitchen_available' => 'nullable|boolean',
            'shared_bathroom' => 'nullable|boolean',
            'rent' => 'nullable|numeric',
            'rent_frequency' => 'nullable|in:Monthly,Daily,Weekly',
            'utilities_included' => 'nullable|boolean',
            'newPhotos.*' => ['nullable', 'string', function ($attribute, $value, $fail) {
                if (!preg_match('/^data:image\/(jpeg|png|jpg|gif);base64,/', $value)) {
                    $fail('The ' . $attribute . ' must be a valid base64 encoded image.');
                }

                $imageData = substr($value, strpos($value, ',') + 1);
                $imageData = base64_decode($imageData);
                if (strlen($imageData) > 2 * 1024 * 1024) {
                    $fail('The ' . $attribute . ' must be less than 2MB.');
                }
            }],
            'available_from' => 'nullable|date',
            'available_to' => 'nullable|date',
            'gender_preference' => 'nullable|in:Male,Female,Any',
            'car_parking_available' => 'nullable|boolean',
            'food_preference' => 'nullable|in:Veg,Non Veg,Any',
            'washer_dryer' => 'nullable|boolean',
            'description' => 'nullable|string|max:1000',
            'poster_id' => 'nullable|exists:users,id'
        ]);

        $receiver = User::find($request->poster_id);
        if (!$receiver) {
            return response()->json(['error' => 'User not found'], 404);
        }
        $data = $request->except(['photos', 'newPhotos', 'existingPhotos']);
        $data['poster_name'] = $receiver->name;

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

                $path = storage_path('app/public/roommates/' . $filename);

                file_put_contents($path, $imageData);

                $photos[] = 'storage/roommates/' . $filename;
            }
            // $data['photos'] = json_encode($photos);
        }

        $allPhotos = array_merge($photos, $existingPhotos);
        $data['photos'] = json_encode($allPhotos);
        $roomMate->update($data);

        // Return photos as array in response
        $roomMate->photos = json_decode($roomMate->photos, true);

        return response()->json([
            'message' => 'Room mate updated successfully',
            'data' => $roomMate
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/roommates/{id}",
     *     summary="Delete a room mate",
     *     tags={"RoomMates"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Room Mate ID", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Room mate deleted successfully")
     * )
     */
    public function destroy($id)
    {
        $roomMate = RoomMate::find($id);

        if (!$roomMate) {
            return response()->json(['message' => 'Room mate not found'], 404);
        }

        $roomMate->delete();

        return response()->json(['message' => 'Room mate deleted successfully']);
    }
}
