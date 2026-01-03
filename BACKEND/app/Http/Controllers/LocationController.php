<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\LocationStateCityZip; // Make sure you have a City model

class LocationController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/location/locations",
     *     summary="Get location records",
     *     description="Fetch all location records or filter by state name, city, or zip using a single 'filter' field",
     *     operationId="getLocations",
     *     tags={"Location"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="filter",
     *         in="query",
     *         description="Value to filter by state name, city, or zip",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of locations",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="zip", type="string", description="ZIP Code"),
     *                 @OA\Property(property="city", type="string", description="City"),
     *                 @OA\Property(property="state_id", type="string", description="State ID"),
     *                 @OA\Property(property="state_name", type="string", description="State Name"),
     *                 @OA\Property(property="stateID_state_name", type="string", description="State ID and Name Combined"),
     *                 @OA\Property(property="timezone", type="string", description="Timezone"),
     *                 @OA\Property(property="lat", type="string", description="Latitude"),
     *                 @OA\Property(property="lng", type="string", description="Longitude"),
     *                 @OA\Property(property="country", type="string", description="Country")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No matching locations found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function getlocations(Request $request)
    {
        $filter = $request->input('filter');

        $query = LocationStateCityZip::query();

        if ($filter) {
            $filter = strtolower($filter); // convert input to lowercase once

            $query->where(function($q) use ($filter) {
                $q->whereRaw('LOWER(state_name) LIKE ?', ["%{$filter}%"])
                ->orWhereRaw('LOWER(city) LIKE ?', ["%{$filter}%"])
                ->orWhereRaw('LOWER(zip) LIKE ?', ["%{$filter}%"]);
            });
        }

        $locations = $query->orderBy('state_name')->get();

        if ($locations->isEmpty()) {
            return response()->json([
                'error' => 'No matching locations found.'
            ], 404);
        }

        return response()->json($locations);
    }

    
    /**
     * @OA\Get(
     *     path="/api/location/states",
     *     summary="Get list of states",
     *     description="Fetch all distinct states with their IDs and names",
     *     operationId="getStates",
     *     tags={"Location"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of states",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="state_id", type="string", description="State ID"),
     *                 @OA\Property(property="state_name", type="string", description="State Name")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No states found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function getstates()
    {
        $states = LocationStateCityZip::select('state_id', 'state_name')
                    ->distinct()
                    ->orderBy('state_name')
                    ->get();

        if ($states->isEmpty()) {
            return response()->json([
            'error' => 'No states found.'
            ], 404);
        }

        return response()->json($states);
    }

    /**
     * @OA\Get(
     *     path="/api/location/cities",
     *     summary="Get cities by stateId",
     *     description="Fetch all cities for a given stateId",
     *     operationId="getCities",
     *     tags={"Location"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="stateId",
     *         in="query",
     *         required=true,
     *         description="State ID to filter cities",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of cities",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="id", type="integer", description="City record ID"),
     *                 @OA\Property(property="zip", type="string", description="Zip code"),
     *                 @OA\Property(property="city", type="string", description="City name"),
     *                 @OA\Property(property="state_id", type="string", description="State ID"),
     *                 @OA\Property(property="state_name", type="string", description="State name"),
     *                 @OA\Property(property="stateID_state_name", type="string", description="State ID and State name combined"),
     *                 @OA\Property(property="timezone", type="string", description="Timezone"),
     *                 @OA\Property(property="lat", type="number", format="float", description="Latitude"),
     *                 @OA\Property(property="lng", type="number", format="float", description="Longitude"),
     *                 @OA\Property(property="country", type="string", description="Country code"),
     *                 @OA\Property(property="created_at", type="string", format="date-time", description="Created timestamp"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", description="Updated timestamp")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="stateId is required"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No cities found for the given stateId"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function getcities(Request $request)
    {
        $stateId = $request->query('stateId');
        if (!$stateId) {
            return response()->json([
                'error' => 'stateId is required.'
            ], 400);
        }
        $cities = LocationStateCityZip::where('state_id', $stateId)->get();
        if ($cities->isEmpty()) {
            return response()->json([
                'error' => 'No cities found for the given stateId.'
            ], 404);
        }

        return response()->json($cities);
    }

    /**
     * @OA\Get(
     *     path="/api/location/zipcodes",
     *     summary="Get zipcodes by city",
     *     description="Fetch all distinct zipcodes for a given city",
     *     operationId="getZipcodes",
     *     tags={"Location"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="city",
     *         in="query",
     *         required=true,
     *         description="City name to filter zipcodes",
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of zipcodes",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 @OA\Property(property="zip", type="string", description="Zip code")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="city is required"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No zipcodes found for the given city"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function getzipcodes(Request $request)
    {
        $city = $request->query('city');

        if (!$city) {
            return response()->json([
                'error' => 'city is required.'
            ], 400);
        }

        $zipcodes = LocationStateCityZip::where('city', $city)
                    ->select('zip')
                    ->distinct()
                    ->orderBy('zip')
                    ->get();
        
        if ($zipcodes->isEmpty()) {
            return response()->json([
                'error' => 'No zipcodes found for the given city.'
            ], 404);
        }

        return response()->json($zipcodes);
    }
    
}
