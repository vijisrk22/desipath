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
        try {
            $filter = $request->input('filter');

            $query = UsaZipcode::query();

            if ($filter) {
                // $filter = strtolower($filter);
                $query->where(function($q) use ($filter) {
                    $q->where('state_name', 'LIKE', "%{$filter}%")
                    ->orWhere('city', 'LIKE', "%{$filter}%")
                    ->orWhere('zip', 'LIKE', "%{$filter}%");
                });
            }

            // Limit results to avoid huge payload
            $locations = $query->orderBy('state_name')->limit(50)->get();



            return response()->json($locations);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Location Search Error: " . $e->getMessage());
            return response()->json([
                'error' => 'Internal Server Error',
                'message' => $e->getMessage(),
                'file' => $e->getFile(), // Debug info
                'line' => $e->getLine()  // Debug info
            ], 500);
        }
    }

    // Temporary helper to fix production DB
    public function runMigrations()
    {
        try {
            \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
            return response()->json([
                'status' => 'success',
                'message' => 'Migrations executed successfully',
                'output' => \Illuminate\Support\Facades\Artisan::output()
            ]);
        } catch (\Throwable $e) {
             return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    public function deduplicateLocations()
    {
        try {
            $before = \App\Models\UsaZipcode::count();
            
            // Delete all duplicate rows, keeping only the one with the lowest ID per unique zip+city+state
            \Illuminate\Support\Facades\DB::statement('
                DELETE FROM usa_zipcodes 
                WHERE id NOT IN (
                    SELECT min_id FROM (
                        SELECT MIN(id) as min_id 
                        FROM usa_zipcodes 
                        GROUP BY zip, city, state_id
                    ) AS keep
                )
            ');
            
            $after = \App\Models\UsaZipcode::count();
            $removed = $before - $after;
            
            return response()->json([
                'status'  => 'success',
                'message' => "Deduplication complete. Removed {$removed} duplicates.",
                'before'  => $before,
                'after'   => $after,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function runSeeders()
    {
        try {
            \Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'Database\Seeders\UsaZipcodeSeeder', '--force' => true]);
            return response()->json([
                'status' => 'success',
                'message' => 'Seeding executed successfully',
                'output' => \Illuminate\Support\Facades\Artisan::output()
            ]);
        } catch (\Throwable $e) {
             return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    // Direct DB insert — avoids Artisan cache issues on Azure
    public function runCarAttributesSetup()
    {
        try {
            $db = \Illuminate\Support\Facades\DB::table('car_fuel_types');
            if ($db->count() === 0) {
                $now = now();
                \Illuminate\Support\Facades\DB::table('car_fuel_types')->insert([
                    ['name' => 'Gas',    'created_at' => $now, 'updated_at' => $now],
                    ['name' => 'EV',     'created_at' => $now, 'updated_at' => $now],
                    ['name' => 'Hybrid', 'created_at' => $now, 'updated_at' => $now],
                    ['name' => 'Diesel', 'created_at' => $now, 'updated_at' => $now],
                ]);
            }
            if (\Illuminate\Support\Facades\DB::table('car_transmissions')->count() === 0) {
                $now = now();
                \Illuminate\Support\Facades\DB::table('car_transmissions')->insert([
                    ['name' => 'Automatic', 'created_at' => $now, 'updated_at' => $now],
                    ['name' => 'Manual',    'created_at' => $now, 'updated_at' => $now],
                    ['name' => 'CVT',       'created_at' => $now, 'updated_at' => $now],
                ]);
            }
            if (\Illuminate\Support\Facades\DB::table('car_conditions')->count() === 0) {
                $now = now();
                \Illuminate\Support\Facades\DB::table('car_conditions')->insert([
                    ['name' => 'Excellent', 'created_at' => $now, 'updated_at' => $now],
                    ['name' => 'Good',      'created_at' => $now, 'updated_at' => $now],
                    ['name' => 'Average',   'created_at' => $now, 'updated_at' => $now],
                ]);
            }
            return response()->json(['status' => 'success', 'message' => 'Car attributes seeded successfully']);
        } catch (\Throwable $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
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


        return response()->json($states);
    }

    public function getcities(Request $request)
    {
        $stateId = $request->query('stateId');
        if (!$stateId) return response()->json(['error' => 'stateId is required.'], 400);
        
        $cities = UsaZipcode::where('state_id', $stateId)->select('city', 'zip', 'lat', 'lng', 'state_id', 'state_name')->limit(100)->get();

        return response()->json($cities);
    }

    public function getzipcodes(Request $request)
    {
        $city = $request->query('city');
        if (!$city) return response()->json(['error' => 'city is required.'], 400);

        $zipcodes = UsaZipcode::where('city', $city)->select('zip')->distinct()->orderBy('zip')->get();

        return response()->json($zipcodes);
    }
}


