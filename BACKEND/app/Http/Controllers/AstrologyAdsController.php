<?php

namespace App\Http\Controllers;

use App\Models\AstrologyAd;
use Illuminate\Http\Request;
use Faker\Factory as Faker;
use OpenApi\Annotations as OA;

/**
* @OA\Schema(
    *     schema="AstrologyAd",
    *     @OA\Property(property="astrologer_type", type="string", example="Vedic"),
    *     @OA\Property(property="address", type="string", example="456 Spiritual Ave"),
    *     @OA\Property(property="state", type="string", example="Tamil Nadu"),
    *     @OA\Property(property="city", type="string", example="Chennai"),
    *     @OA\Property(property="description", type="string", example="Expert in Vedic Astrology with 10+ years of experience."),
    *     @OA\Property(property="image", type="string", example="astrologer.jpg"),
    *     @OA\Property(property="price", type="number", format="decimal", example=300.00),
    *     @OA\Property(property="language_specific", type="boolean", example=true),
    *     @OA\Property(property="language", type="array", @OA\Items(type="string"), example={"Tamil", "English"}),
    *     @OA\Property(property="contact_form", type="string", example="Contact via email or phone."),
    *     @OA\Property(property="user_id", type="integer", example=1)
    * )
    */
class AstrologyAdsController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/astrologyads",
     *     summary="Get list of astrology ads",
     *     tags={"AstrologyAds"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="List of astrology ads")
     * )
     */
    public function index()
    {
        return AstrologyAd::all();
    }

    /**
     * Dummy Insert API for AstrologyAd
     *
     * @return \Illuminate\Http\JsonResponse
     */
    /**
     * @OA\Post(
     *     path="/api/astrologyads/dummy-insert",
     *     summary="Insert a dummy astrology",
     *     tags={"AstrologyAds"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=201, description="Dummy astrology added successfully")
     * )
     */
    public function dummyInsert()
    {
        $faker = Faker::create();

        $dummyData = [
            'astrologer_type' => $faker->randomElement(['Vedic', 'Western', 'Chinese', 'Numerology']),
            'address' => $faker->address,
            'state' => $faker->state,
            'city' => $faker->city,
            'description' => $faker->sentence,
            'image' => 'example.jpg',
            'price' => $faker->randomFloat(2, 100, 5000),
            'language_specific' => $faker->boolean,
            'language' => $faker->randomElements(['Tamil', 'English', 'Hindi', 'Telugu'], $faker->numberBetween(1, 4)),
            'contact_form' => $faker->paragraph,
            'user_id' => $faker->numberBetween(1, 4)
        ];

        $astrologyAd = AstrologyAd::create($dummyData);

        return response()->json([
            'message' => 'Dummy astrology ad added successfully',
            'data' => $astrologyAd
        ], 201);
    }

    /**
     * @OA\Post(
     *     path="/api/astrologyads",
     *     summary="Create a new astrology ad",
     *     tags={"AstrologyAds"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"astrologer_type", "address", "state", "city"},
     *             @OA\Property(property="astrologer_type", type="string", example="Vedic"),
     *             @OA\Property(property="address", type="string", example="456 Spiritual Ave"),
     *             @OA\Property(property="state", type="string", example="Tamil Nadu"),
     *             @OA\Property(property="city", type="string", example="Chennai"),
     *             @OA\Property(property="description", type="string", example="Expert in Vedic Astrology"),
     *             @OA\Property(property="image", type="string", example="astrologer.jpg"),
     *             @OA\Property(property="price", type="number", format="decimal", example=300.00),
     *             @OA\Property(property="language_specific", type="boolean", example=true),
     *             @OA\Property(property="language", type="array", @OA\Items(type="string"), example={"Tamil", "English"}),
     *             @OA\Property(property="contact_form", type="string", example="Contact via email or phone."),
     *             @OA\Property(property="user_id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(response=201, description="Astrology ad created successfully")
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'astrologer_type' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'state' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'price' => 'nullable|numeric',
            'language_specific' => 'nullable|boolean',
            'language' => 'nullable|array',
            'contact_form' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id'
        ]);

        $astrologyAd = AstrologyAd::create($request->all());

        return response()->json(['message' => 'Astrology ad added successfully', 'data' => $astrologyAd], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/astrologyads/{id}",
     *     summary="Get details of a specific astrology ad",
     *     tags={"AstrologyAds"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Astrology Ad ID", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Astrology ad details")
     * )
     */
    public function show($id)
    {
        $astrologyAd = AstrologyAd::find($id);

        if (!$astrologyAd) {
            return response()->json(['message' => 'Astrology ad not found'], 404);
        }

        return response()->json($astrologyAd);
    }

    /**
     * @OA\Put(
     *     path="/api/astrologyads/{id}",
     *     summary="Update an existing astrology ad",
     *     tags={"AstrologyAds"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Astrology Ad ID", @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/AstrologyAd")
     *     ),
     *     @OA\Response(response=200, description="Astrology ad updated successfully")
     * )
     */
    public function update(Request $request, $id)
    {
        $astrologyAd = AstrologyAd::find($id);

        if (!$astrologyAd) {
            return response()->json(['message' => 'Astrology ad not found'], 404);
        }

        $request->validate([
            'astrologer_type' => 'sometimes|string|max:255',
            'address' => 'sometimes|string|max:255',
            'state' => 'sometimes|string|max:100',
            'city' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'price' => 'nullable|numeric',
            'language_specific' => 'nullable|boolean',
            'language' => 'nullable|array',
            'contact_form' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id'
        ]);

        $astrologyAd->update($request->all());

        return response()->json(['message' => 'Astrology ad updated successfully', 'data' => $astrologyAd]);
    }

    /**
     * @OA\Delete(
     *     path="/api/astrologyads/{id}",
     *     summary="Delete an astrology ad",
     *     tags={"AstrologyAds"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Astrology Ad ID", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Astrology ad deleted successfully")
     * )
     */
    public function destroy($id)
    {
        $astrologyAd = AstrologyAd::find($id);

        if (!$astrologyAd) {
            return response()->json(['message' => 'Astrology ad not found'], 404);
        }

        $astrologyAd->delete();

        return response()->json(['message' => 'Astrology ad deleted successfully']);
    }
}
