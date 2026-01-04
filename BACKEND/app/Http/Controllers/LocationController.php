<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\UsaZipcode; // Updated to use new model

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
     *                 @OA\Property(property="timezone", type="string", description="Timezone"),
     *                 @OA\Property(property="lat", type="string", description="Latitude"),
     *                 @OA\Property(property="lng", type="string", description="Longitude")
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

        $query = UsaZipcode::query();

        if ($filter) {
            $filter = strtolower($filter);

            $query->where(function($q) use ($filter) {
                $q->whereRaw('LOWER(state_name) LIKE ?', ["%{$filter}%"])
                ->orWhereRaw('LOWER(city) LIKE ?', ["%{$filter}%"])
                ->orWhereRaw('LOWER(zip) LIKE ?', ["%{$filter}%"]);
            });
        }

        // Limit results to avoid huge payload
        $locations = $query->orderBy('state_name')->limit(50)->get();

        if ($locations->isEmpty()) {
            return response()->json([
                'error' => 'No matching locations found.'
            ], 404);
        }

        return response()->json($locations);
    }
    
    public function reverseGeocode(Request $request)
    {
        $lat = $request->input('lat');
        $lng = $request->input('lng');

        if (!$lat || !$lng) {
            return response()->json(['error' => 'Latitude and Longitude required'], 400);
        }

        // Haversine formula to find nearest zipcode
        $location = UsaZipcode::select('*')
            ->selectRaw('( 3959 * acos( cos( radians(?) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(?) ) + sin( radians(?) ) * sin( radians( lat ) ) ) ) AS distance', [$lat, $lng, $lat])
            ->orderBy('distance')
            ->first();

        if (!$location) {
            return response()->json(['error' => 'No location found'], 404);
        }

        return response()->json($location);
    }

    // Other methods adapted if necessary, referencing UsaZipcode...
    // For brevity, assuming only getlocations/reverseGeocode are critical for this task,
    // but I should keep getstates, getcities, getzipcodes for compatibility.
    
    public function getstates()
    {
        $states = UsaZipcode::select('state_id', 'state_name')
                    ->distinct()
                    ->orderBy('state_name')
                    ->get();

        if ($states->isEmpty()) {
            return response()->json(['error' => 'No states found.'], 404);
        }
        return response()->json($states);
    }

    public function getcities(Request $request)
    {
        $stateId = $request->query('stateId');
        if (!$stateId) return response()->json(['error' => 'stateId is required.'], 400);
        
        $cities = UsaZipcode::where('state_id', $stateId)->select('city', 'zip', 'lat', 'lng', 'state_id', 'state_name')->limit(100)->get();
        if ($cities->isEmpty()) return response()->json(['error' => 'No cities found.'], 404);
        return response()->json($cities);
    }

    public function getzipcodes(Request $request)
    {
        $city = $request->query('city');
        if (!$city) return response()->json(['error' => 'city is required.'], 400);

        $zipcodes = UsaZipcode::where('city', $city)->select('zip')->distinct()->orderBy('zip')->get();
        if ($zipcodes->isEmpty()) return response()->json(['error' => 'No zipcodes found.'], 404);
        return response()->json($zipcodes);
    }
}


