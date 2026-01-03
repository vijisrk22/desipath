<?php

namespace App\Http\Controllers;

use App\Models\TravelCompanion;
use Illuminate\Http\Request;
use Faker\Factory as Faker;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(name="TravelCompanions", description="Travel companions API")
 */
class TravelCompanionsController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/travelcompanions",
     *     summary="Get list of travel companions",
     *     tags={"TravelCompanions"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="List of travel companions")
     * )
     */
    public function index()
    {
        return TravelCompanion::all();
    }

    /**
     * @OA\Post(
     *     path="/api/travelcompanions/dummy-insert",
     *     summary="Insert a dummy travel companion",
     *     tags={"TravelCompanions"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=201, description="Dummy travel companion added successfully")
     * )
     */
    public function dummyInsert()
    {
        $faker = Faker::create();

        $dummyData = [
            'travellers' => $faker->name . ', ' . $faker->name,
            'language_spoken' => $faker->randomElements(['Tamil', 'Telugu', 'Hindi'], 2),
            'language_travellers' => $faker->randomElements(['Tamil', 'Telugu', 'Hindi'], 2),
            'travel_date' => $faker->date(),
            'flexible_language' => $faker->boolean,
            'tentative' => $faker->boolean,
            'travel_finalized' => $faker->boolean,
            'finalized_date' => $faker->date(),
            'from_location' => $faker->city,
            'to_location' => $faker->city,
            'service_preference' => $faker->randomElement(['Amazon gift card', 'Volunteer (Free service)']),
            'amazon_gift_card_value' => $faker->randomElement(['50$', '100$']),
            'willing_gift' => $faker->boolean,
            'gift_card_value' => $faker->randomElement(['50$', '100$']),
            'poster_id' => $faker->numberBetween(1, 3)
        ];

        $travelCompanion = TravelCompanion::create($dummyData);

        return response()->json([
            'message' => 'Dummy travel companion added successfully',
            'data' => $travelCompanion
        ], 201);
    }

    public function findcomplocation(Request $request) {
        $locations = [
            'from' => TravelCompanion::select('from_location')->distinct()->pluck('from_location'),
            'to'   => TravelCompanion::select('to_location')->distinct()->pluck('to_location'),
        ];

        return $locations;
    }

    /**
     * @OA\Post(
     *     path="/api/travelcompanions",
     *     summary="Create a new travel companion",
     *     tags={"TravelCompanions"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/TravelCompanion")
     *     ),
     *     @OA\Response(response=201, description="Travel companion created successfully")
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'details.travellers_who' => 'required|string|in:findcomp,becomp', // adjust allowed values
            'details.travellers' => 'required_if:travellers_who,findcomp|string|max:255',
            // 'details.travellers' => 'required|string|max:255',
            'details.language_spoken' => 'required|string',
            // 'details.language_travellers' => 'required|array',
            'details.travel_date' => 'nullable|date',
            // 'details.flexible_language' => 'nullable|boolean',
            'details.flexible_language' => 'nullable|string|in:Yes,No', // accept Yes/No
            'details.tentative' => 'nullable|boolean',
            // 'details.travel_finalized' => 'nullable|boolean',
            'details.travel_finalized' => 'nullable|string|in:Yes,No',
            'details.finalized_date' => 'nullable|date',
            'details.from_location' => 'required|string|max:255',
            'details.to_location' => 'required|string|max:255',
            'details.service_preference' => 'nullable|string|in:Amazon gift card,Volunteer (Free service)',
            'details.amazon_gift_card_value' => 'nullable|string|in:50$,100$',
            'details.willing_gift' => 'nullable|boolean',
            'details.gift_card_value' => 'nullable|string|in:$50,$100',
            'details.poster_id' => 'nullable|exists:users,id'
        ]);

        $data = $request->input('details');
        // Convert space-separated to comma-separated
        $languageSpoken = preg_replace('/\s+/', ',', trim($request->input('details.language_spoken')));
        $data['details']['language_spoken'] = $languageSpoken;
        // $travelCompanion = TravelCompanion::create($request->all());

        // 🔹 Convert Yes/No into boolean values
        $data['flexible_language'] = ($data['flexible_language'] ?? null) === 'Yes';
        $data['travel_finalized'] = ($data['travel_finalized'] ?? null) === 'Yes';

        $travelCompanion = TravelCompanion::create($data);

        return response()->json(['message' => 'Travel companion created successfully', 'data' => $travelCompanion], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/travelcompanions/{id}",
     *     summary="Get details of a specific travel companion",
     *     tags={"TravelCompanions"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Travel companion ID", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Travel companion details")
     * )
     */
    public function show($id)
    {
        $travelCompanion = TravelCompanion::find($id);

        if (!$travelCompanion) {
            return response()->json(['message' => 'Travel companion not found'], 404);
        }

        return response()->json($travelCompanion);
    }

    /**
     * @OA\Put(
     *     path="/api/travelcompanions/{id}",
     *     summary="Update an existing travel companion",
     *     tags={"TravelCompanions"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Travel companion ID", @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/TravelCompanion")
     *     ),
     *     @OA\Response(response=200, description="Travel companion updated successfully")
     * )
     */
    public function update(Request $request, $id)
    {
        $travelCompanion = TravelCompanion::find($id);

        if (!$travelCompanion) {
            return response()->json(['message' => 'Travel companion not found'], 404);
        }

        $request->validate([
            'travellers' => 'sometimes|string|max:255',
            'language_spoken' => 'sometimes|array',
            'language_travellers' => 'sometimes|array',
            'travel_date' => 'nullable|date',
            'flexible_language' => 'nullable|boolean',
            'tentative' => 'nullable|boolean',
            'travel_finalized' => 'nullable|boolean',
            'finalized_date' => 'nullable|date',
            'from_location' => 'sometimes|string|max:255',
            'to_location' => 'sometimes|string|max:255',
            'service_preference' => 'nullable|string|in:Amazon gift card,Volunteer (Free service)',
            'amazon_gift_card_value' => 'nullable|string|in:50$,100$',
            'willing_gift' => 'nullable|boolean',
            'gift_card_value' => 'nullable|string|in:50$,100$',
            'poster_id' => 'nullable|exists:users,id'
        ]);

        $travelCompanion->update($request->all());

        return response()->json(['message' => 'Travel companion updated successfully', 'data' => $travelCompanion]);
    }

    /**
     * @OA\Delete(
     *     path="/api/travelcompanions/{id}",
     *     summary="Delete a travel companion",
     *     tags={"TravelCompanions"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, description="Travel companion ID", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Travel companion deleted successfully")
     * )
     */
    public function destroy($id)
    {
        $travelCompanion = TravelCompanion::find($id);

        if (!$travelCompanion) {
            return response()->json(['message' => 'Travel companion not found'], 404);
        }

        $travelCompanion->delete();

        return response()->json(['message' => 'Travel companion deleted successfully']);
    }
}
