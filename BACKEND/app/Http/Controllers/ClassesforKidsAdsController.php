<?php

namespace App\Http\Controllers;

use App\Models\ClassesforKidsAd;
use Illuminate\Http\Request;
use Faker\Factory as Faker;
use OpenApi\Annotations as OA;

/**
* @OA\Schema(
*     schema="ClassesforKidsAd",
*     @OA\Property(property="class_type", type="string", example="Math"),
*     @OA\Property(property="address", type="string", example="123 Learning Street"),
*     @OA\Property(property="state", type="string", example="Tamil Nadu"),
*     @OA\Property(property="city", type="string", example="Chennai"),
*     @OA\Property(property="description", type="string", example="Expert tutor for kids with over 5 years of experience in Math."),
*     @OA\Property(property="image", type="string", example="math_tutor.jpg"),
*     @OA\Property(property="start_date", type="string", format="date", example="2024-01-01"),
*     @OA\Property(property="price", type="number", format="decimal", example=300.00),
*     @OA\Property(property="language_specific", type="boolean", example=true),
*     @OA\Property(property="language", type="array", @OA\Items(type="string"), example={"Tamil", "English"}),
*     @OA\Property(property="contact_form", type="string", example="Contact via phone or email."),
*     @OA\Property(property="user_id", type="integer", example=1)
* )
*/
class ClassesforKidsAdsController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/classesforkidsads",
     *     summary="Get list of classes for kids ads",
     *     tags={"ClassesforKidsAds"},
     *     @OA\Response(response=200, description="List of classes for kids ads")
     * )
     */
    public function index()
    {
        return ClassesforKidsAd::all();
    }

    /**
     * @OA\Post(
     *     path="/api/classesforkidsads/dummy-insert",
     *     summary="Insert a dummy class for kids ad",
     *     tags={"ClassesforKidsAds"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=201, description="Dummy class for kids ad added successfully")
     * )
     */
    public function dummyInsert()
    {
        $faker = Faker::create();

        $dummyData = [
            'class_type' => $faker->randomElement(['Math', 'Science', 'Arts', 'Music']),
            'address' => $faker->address,
            'state' => $faker->state,
            'city' => $faker->city,
            'description' => $faker->sentence,
            'image' => 'example.jpg',
            'start_date' => $faker->date(),
            'price' => $faker->randomFloat(2, 100, 5000),
            'language_specific' => $faker->boolean,
            'language' => $faker->randomElements(['Tamil', 'English', 'Hindi', 'Telugu'], $faker->numberBetween(1, 4)),
            'contact_form' => $faker->paragraph,
            'user_id' => $faker->numberBetween(1, 3)
        ];

        $classesforKidsAd = ClassesforKidsAd::create($dummyData);

        return response()->json([
            'message' => 'Dummy class for kids ad added successfully',
            'data' => $classesforKidsAd
        ], 201);
    }

    /**
     * @OA\Post(
     *     path="/api/classesforkidsads",
     *     summary="Create a new class for kids ad",
     *     tags={"ClassesforKidsAds"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/ClassesforKidsAd")
     *     ),
     *     @OA\Response(response=201, description="Class for kids ad created successfully")
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'class_type' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'state' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'start_date' => 'required|date',
            'price' => 'nullable|numeric',
            'language_specific' => 'nullable|boolean',
            'language' => 'nullable|array',
            'contact_form' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id'
        ]);

        $classesforKidsAd = ClassesforKidsAd::create($request->all());

        return response()->json(['message' => 'Class for kids ad added successfully', 'data' => $classesforKidsAd], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/classesforkidsads/{id}",
     *     summary="Get details of a specific class for kids ad",
     *     tags={"ClassesforKidsAds"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Class for kids Ad ID", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Class for kids ad details")
     * )
     */
    public function show($id)
    {
        $classesforKidsAd = ClassesforKidsAd::find($id);

        if (!$classesforKidsAd) {
            return response()->json(['message' => 'Class for kids ad not found'], 404);
        }

        return response()->json($classesforKidsAd);
    }

    /**
     * @OA\Put(
     *     path="/api/classesforkidsads/{id}",
     *     summary="Update an existing class for kids ad",
     *     tags={"ClassesforKidsAds"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Class for kids Ad ID", @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/ClassesforKidsAd")
     *     ),
     *     @OA\Response(response=200, description="Class for kids ad updated successfully")
     * )
     */
    public function update(Request $request, $id)
    {
        $classesforKidsAd = ClassesforKidsAd::find($id);

        if (!$classesforKidsAd) {
            return response()->json(['message' => 'Class for kids ad not found'], 404);
        }

        $request->validate([
            'class_type' => 'sometimes|string|max:255',
            'address' => 'sometimes|string|max:255',
            'state' => 'sometimes|string|max:100',
            'city' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'start_date' => 'sometimes|date',
            'price' => 'nullable|numeric',
            'language_specific' => 'nullable|boolean',
            'language' => 'nullable|array',
            'contact_form' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id'
        ]);

        $classesforKidsAd->update($request->all());

        return response()->json(['message' => 'Class for kids ad updated successfully', 'data' => $classesforKidsAd]);
    }

    /**
     * @OA\Delete(
     *     path="/api/classesforkidsads/{id}",
     *     summary="Delete a class for kids ad",
     *     tags={"ClassesforKidsAds"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Class for kids Ad ID", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Class for kids ad deleted successfully")
     * )
     */
    public function destroy($id)
    {
        $classesforKidsAd = ClassesforKidsAd::find($id);

        if (!$classesforKidsAd) {
            return response()->json(['message' => 'Class for kids ad not found'], 404);
        }

        $classesforKidsAd->delete();

        return response()->json(['message' => 'Class for kids ad deleted successfully']);
    }
}
