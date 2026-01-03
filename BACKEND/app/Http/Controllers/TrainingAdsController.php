<?php

namespace App\Http\Controllers;

use App\Models\TrainingAd;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;
use Faker\Factory as Faker;

/**
 * @OA\Schema(
 *     schema="TrainingAd",
 *     @OA\Property(property="user_id", type="integer", example=1),
 *     @OA\Property(property="course_title", type="string", example="Web Development Bootcamp"),
 *     @OA\Property(property="course_fee", type="number", format="decimal", example=250.00),
 *     @OA\Property(property="agenda", type="string", example="Introduction, HTML, CSS, JavaScript, and React"),
 *     @OA\Property(property="image_1", type="string", example="course1.jpg"),
 *     @OA\Property(property="image_2", type="string", example="course2.jpg"),
 *     @OA\Property(property="image_3", type="string", example="course3.jpg"),
 *     @OA\Property(property="contact_form", type="string", example="Contact form details"),
 *     @OA\Property(property="timestamp", type="string", format="date-time", example="2024-11-01T00:00:00Z"),
 * )
 */
class TrainingAdsController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/trainingads",
     *     summary="Get list of training ads",
     *     tags={"TrainingAds"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="List of training ads")
     * )
     */
    public function index()
    {
        return TrainingAd::all();
    }

    /**
 * Dummy Insert API for TrainingAd
 *
 * @return \Illuminate\Http\JsonResponse
 */
/**
     * @OA\Post(
     *     path="/api/trainingads/dummy-insert",
     *     summary="Insert a dummy training ads",
     *     tags={"TrainingAds"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=201, description="Dummy training ads added successfully")
     * )
     */
public function dummyInsert()
{
    $faker = Faker::create();

    $dummyData = [
        'user_id' => $faker->numberBetween(1, 10),
        'course_title' => $faker->sentence(3),
        'course_fee' => $faker->randomFloat(2, 50, 2000),
        'agenda' => $faker->paragraph,
        'image_1' => 'course1.jpg',
        'image_2' => 'course2.jpg',
        'image_3' => 'course3.jpg',
        'contact_form' => $faker->email,
        'timestamp' => $faker->dateTimeThisYear->format('Y-m-d H:i:s')
    ];

    $trainingAd = TrainingAd::create($dummyData);

    return response()->json([
        'message' => 'Dummy training ad added successfully',
        'data' => $trainingAd
    ], 201);
}


    /**
     * @OA\Post(
     *     path="/api/trainingads",
     *     summary="Create a new training ad",
     *     tags={"TrainingAds"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/TrainingAd")
     *     ),
     *     @OA\Response(response=201, description="Training ad created successfully")
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'course_title' => 'required|string|max:255',
            'course_fee' => 'nullable|numeric',
            'agenda' => 'nullable|string',
            'image_1' => 'nullable|string',
            'image_2' => 'nullable|string',
            'image_3' => 'nullable|string',
            'contact_form' => 'nullable|string'
        ]);

        $trainingAd = TrainingAd::create($request->all());

        return response()->json(['message' => 'Training ad added successfully', 'data' => $trainingAd], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/trainingads/{id}",
     *     summary="Get details of a specific training ad",
     *     tags={"TrainingAds"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Training Ad ID", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Training ad details")
     * )
     */
    public function show($id)
    {
        $trainingAd = TrainingAd::find($id);

        if (!$trainingAd) {
            return response()->json(['message' => 'Training ad not found'], 404);
        }

        return response()->json($trainingAd);
    }

    /**
     * @OA\Put(
     *     path="/api/trainingads/{id}",
     *     summary="Update an existing training ad",
     *     tags={"TrainingAds"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Training Ad ID", @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/TrainingAd")
     *     ),
     *     @OA\Response(response=200, description="Training ad updated successfully")
     * )
     */
    public function update(Request $request, $id)
    {
        $trainingAd = TrainingAd::find($id);

        if (!$trainingAd) {
            return response()->json(['message' => 'Training ad not found'], 404);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'course_title' => 'required|string|max:255',
            'course_fee' => 'nullable|numeric',
            'agenda' => 'nullable|string',
            'image_1' => 'nullable|string',
            'image_2' => 'nullable|string',
            'image_3' => 'nullable|string',
            'contact_form' => 'nullable|string'
        ]);

        $trainingAd->update($request->all());

        return response()->json(['message' => 'Training ad updated successfully', 'data' => $trainingAd]);
    }

    /**
     * @OA\Delete(
     *     path="/api/trainingads/{id}",
     *     summary="Delete a training ad",
     *     tags={"TrainingAds"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Training Ad ID", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Training ad deleted successfully")
     * )
     */
    public function destroy($id)
    {
        $trainingAd = TrainingAd::find($id);

        if (!$trainingAd) {
            return response()->json(['message' => 'Training ad not found'], 404);
        }

        $trainingAd->delete();

        return response()->json(['message' => 'Training ad deleted successfully']);
    }
}
