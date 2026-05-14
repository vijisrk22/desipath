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
            set_time_limit(0);
            ini_set('memory_limit', '1024M');
            
            // Try to seed from manual data first to ensure something is there
            \Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'Database\Seeders\UsaZipcodeManualSeeder', '--force' => true]);
            
            // Then try the full seeder
            \Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'Database\Seeders\UsaZipcodeSeeder', '--force' => true]);

            // Run the main DatabaseSeeder to populate all marketplace modules
            \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);

            // Sync coordinates for all listings
            $listings = \App\Models\RentalHome::all();
            foreach ($listings as $listing) {
                $coords = \DB::table('usa_zipcodes')->where('zip', $listing->location_zipcode)->first();
                if ($coords) {
                    $listing->latitude = $coords->lat;
                    $listing->longitude = $coords->lng;
                    $listing->save();
                }
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Seeding + Auto-Sync executed',
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
    
    public function runCarMakeModelSetup()
    {
        try {
            $db = \Illuminate\Support\Facades\DB::table('car_makes_models');
            if ($db->count() > 0) {
                return response()->json(['status' => 'success', 'message' => 'Car makes/models already seeded. Count: ' . $db->count()]);
            }

            $now = now();
            $data = [
                ['make'=>'Acura','model'=>'CL'],['make'=>'Acura','model'=>'ILX'],['make'=>'Acura','model'=>'ILX Hybrid'],['make'=>'Acura','model'=>'Integra'],['make'=>'Acura','model'=>'Legend'],['make'=>'Acura','model'=>'MDX'],['make'=>'Acura','model'=>'NSX'],['make'=>'Acura','model'=>'RDX'],['make'=>'Acura','model'=>'RL'],['make'=>'Acura','model'=>'RLX'],['make'=>'Acura','model'=>'RSX'],['make'=>'Acura','model'=>'TL'],['make'=>'Acura','model'=>'TLX'],['make'=>'Acura','model'=>'TSX'],['make'=>'Acura','model'=>'TSX Sport Wagon'],['make'=>'Acura','model'=>'ZDX'],
                ['make'=>'Alfa Romeo','model'=>'4C'],['make'=>'Alfa Romeo','model'=>'Giulia'],['make'=>'Alfa Romeo','model'=>'Stelvio'],['make'=>'Alfa Romeo','model'=>'Tonale'],
                ['make'=>'Audi','model'=>'A3'],['make'=>'Audi','model'=>'A4'],['make'=>'Audi','model'=>'A5'],['make'=>'Audi','model'=>'A6'],['make'=>'Audi','model'=>'A7'],['make'=>'Audi','model'=>'A8'],['make'=>'Audi','model'=>'e-tron'],['make'=>'Audi','model'=>'e-tron GT'],['make'=>'Audi','model'=>'Q3'],['make'=>'Audi','model'=>'Q4 e-tron'],['make'=>'Audi','model'=>'Q5'],['make'=>'Audi','model'=>'Q7'],['make'=>'Audi','model'=>'Q8'],['make'=>'Audi','model'=>'R8'],['make'=>'Audi','model'=>'S4'],['make'=>'Audi','model'=>'S5'],['make'=>'Audi','model'=>'TT'],
                ['make'=>'BMW','model'=>'1 Series'],['make'=>'BMW','model'=>'2 Series'],['make'=>'BMW','model'=>'3 Series'],['make'=>'BMW','model'=>'4 Series'],['make'=>'BMW','model'=>'5 Series'],['make'=>'BMW','model'=>'7 Series'],['make'=>'BMW','model'=>'8 Series'],['make'=>'BMW','model'=>'i3'],['make'=>'BMW','model'=>'i4'],['make'=>'BMW','model'=>'i5'],['make'=>'BMW','model'=>'i7'],['make'=>'BMW','model'=>'i8'],['make'=>'BMW','model'=>'iX'],['make'=>'BMW','model'=>'X1'],['make'=>'BMW','model'=>'X2'],['make'=>'BMW','model'=>'X3'],['make'=>'BMW','model'=>'X4'],['make'=>'BMW','model'=>'X5'],['make'=>'BMW','model'=>'X6'],['make'=>'BMW','model'=>'X7'],['make'=>'BMW','model'=>'Z4'],
                ['make'=>'Buick','model'=>'Enclave'],['make'=>'Buick','model'=>'Encore'],['make'=>'Buick','model'=>'Encore GX'],['make'=>'Buick','model'=>'Envision'],['make'=>'Buick','model'=>'Envista'],['make'=>'Buick','model'=>'LaCrosse'],['make'=>'Buick','model'=>'Regal'],
                ['make'=>'Cadillac','model'=>'ATS'],['make'=>'Cadillac','model'=>'CT4'],['make'=>'Cadillac','model'=>'CT5'],['make'=>'Cadillac','model'=>'CT6'],['make'=>'Cadillac','model'=>'CTS'],['make'=>'Cadillac','model'=>'Escalade'],['make'=>'Cadillac','model'=>'Escalade ESV'],['make'=>'Cadillac','model'=>'LYRIQ'],['make'=>'Cadillac','model'=>'SRX'],['make'=>'Cadillac','model'=>'XT4'],['make'=>'Cadillac','model'=>'XT5'],['make'=>'Cadillac','model'=>'XT6'],['make'=>'Cadillac','model'=>'XTS'],
                ['make'=>'Chevrolet','model'=>'Blazer'],['make'=>'Chevrolet','model'=>'Bolt EV'],['make'=>'Chevrolet','model'=>'Camaro'],['make'=>'Chevrolet','model'=>'Colorado'],['make'=>'Chevrolet','model'=>'Corvette'],['make'=>'Chevrolet','model'=>'Cruze'],['make'=>'Chevrolet','model'=>'Equinox'],['make'=>'Chevrolet','model'=>'Impala'],['make'=>'Chevrolet','model'=>'Malibu'],['make'=>'Chevrolet','model'=>'Silverado 1500'],['make'=>'Chevrolet','model'=>'Silverado 2500HD'],['make'=>'Chevrolet','model'=>'Silverado 3500HD'],['make'=>'Chevrolet','model'=>'Suburban'],['make'=>'Chevrolet','model'=>'Tahoe'],['make'=>'Chevrolet','model'=>'TrailBlazer'],['make'=>'Chevrolet','model'=>'Traverse'],['make'=>'Chevrolet','model'=>'Trax'],
                ['make'=>'Chrysler','model'=>'300'],['make'=>'Chrysler','model'=>'Pacifica'],['make'=>'Chrysler','model'=>'Pacifica Hybrid'],['make'=>'Chrysler','model'=>'Town and Country'],['make'=>'Chrysler','model'=>'Voyager'],
                ['make'=>'Dodge','model'=>'Challenger'],['make'=>'Dodge','model'=>'Charger'],['make'=>'Dodge','model'=>'Durango'],['make'=>'Dodge','model'=>'Grand Caravan'],['make'=>'Dodge','model'=>'Hornet'],['make'=>'Dodge','model'=>'Journey'],['make'=>'Dodge','model'=>'Ram Pickup 1500'],['make'=>'Dodge','model'=>'Ram Pickup 2500'],
                ['make'=>'Ferrari','model'=>'458 Italia'],['make'=>'Ferrari','model'=>'488 GTB'],['make'=>'Ferrari','model'=>'812 Superfast'],['make'=>'Ferrari','model'=>'California'],['make'=>'Ferrari','model'=>'Portofino'],
                ['make'=>'FIAT','model'=>'500'],['make'=>'FIAT','model'=>'500e'],['make'=>'FIAT','model'=>'500L'],['make'=>'FIAT','model'=>'500X'],
                ['make'=>'Ford','model'=>'Bronco'],['make'=>'Ford','model'=>'Bronco Sport'],['make'=>'Ford','model'=>'Edge'],['make'=>'Ford','model'=>'Escape'],['make'=>'Ford','model'=>'Expedition'],['make'=>'Ford','model'=>'Explorer'],['make'=>'Ford','model'=>'F-150'],['make'=>'Ford','model'=>'F-150 Lightning'],['make'=>'Ford','model'=>'F-250 Super Duty'],['make'=>'Ford','model'=>'F-350 Super Duty'],['make'=>'Ford','model'=>'Fusion'],['make'=>'Ford','model'=>'Maverick'],['make'=>'Ford','model'=>'Mustang'],['make'=>'Ford','model'=>'Mustang Mach-E'],['make'=>'Ford','model'=>'Ranger'],['make'=>'Ford','model'=>'Taurus'],
                ['make'=>'Genesis','model'=>'G70'],['make'=>'Genesis','model'=>'G80'],['make'=>'Genesis','model'=>'G90'],['make'=>'Genesis','model'=>'GV60'],['make'=>'Genesis','model'=>'GV70'],['make'=>'Genesis','model'=>'GV80'],
                ['make'=>'GMC','model'=>'Acadia'],['make'=>'GMC','model'=>'Canyon'],['make'=>'GMC','model'=>'HUMMER EV'],['make'=>'GMC','model'=>'Sierra 1500'],['make'=>'GMC','model'=>'Sierra 2500HD'],['make'=>'GMC','model'=>'Sierra 3500HD'],['make'=>'GMC','model'=>'Terrain'],['make'=>'GMC','model'=>'Yukon'],['make'=>'GMC','model'=>'Yukon XL'],
                ['make'=>'Honda','model'=>'Accord'],['make'=>'Honda','model'=>'Accord Hybrid'],['make'=>'Honda','model'=>'Civic'],['make'=>'Honda','model'=>'CR-V'],['make'=>'Honda','model'=>'CR-V Hybrid'],['make'=>'Honda','model'=>'Fit'],['make'=>'Honda','model'=>'HR-V'],['make'=>'Honda','model'=>'Insight'],['make'=>'Honda','model'=>'Odyssey'],['make'=>'Honda','model'=>'Passport'],['make'=>'Honda','model'=>'Pilot'],['make'=>'Honda','model'=>'Prologue'],['make'=>'Honda','model'=>'Ridgeline'],
                ['make'=>'Hyundai','model'=>'Accent'],['make'=>'Hyundai','model'=>'Elantra'],['make'=>'Hyundai','model'=>'Elantra Hybrid'],['make'=>'Hyundai','model'=>'IONIQ 5'],['make'=>'Hyundai','model'=>'IONIQ 6'],['make'=>'Hyundai','model'=>'Kona'],['make'=>'Hyundai','model'=>'Kona Electric'],['make'=>'Hyundai','model'=>'Palisade'],['make'=>'Hyundai','model'=>'Santa Cruz'],['make'=>'Hyundai','model'=>'Santa Fe'],['make'=>'Hyundai','model'=>'Sonata'],['make'=>'Hyundai','model'=>'Sonata Hybrid'],['make'=>'Hyundai','model'=>'Tucson'],['make'=>'Hyundai','model'=>'Venue'],
                ['make'=>'INFINITI','model'=>'Q50'],['make'=>'INFINITI','model'=>'Q60'],['make'=>'INFINITI','model'=>'QX50'],['make'=>'INFINITI','model'=>'QX55'],['make'=>'INFINITI','model'=>'QX60'],['make'=>'INFINITI','model'=>'QX80'],
                ['make'=>'Jeep','model'=>'Cherokee'],['make'=>'Jeep','model'=>'Compass'],['make'=>'Jeep','model'=>'Gladiator'],['make'=>'Jeep','model'=>'Grand Cherokee'],['make'=>'Jeep','model'=>'Grand Cherokee 4xe'],['make'=>'Jeep','model'=>'Grand Cherokee L'],['make'=>'Jeep','model'=>'Renegade'],['make'=>'Jeep','model'=>'Wagoneer'],['make'=>'Jeep','model'=>'Wrangler'],['make'=>'Jeep','model'=>'Wrangler 4xe'],
                ['make'=>'Kia','model'=>'Carnival'],['make'=>'Kia','model'=>'EV6'],['make'=>'Kia','model'=>'EV9'],['make'=>'Kia','model'=>'Forte'],['make'=>'Kia','model'=>'K5'],['make'=>'Kia','model'=>'Niro'],['make'=>'Kia','model'=>'Niro EV'],['make'=>'Kia','model'=>'Rio'],['make'=>'Kia','model'=>'Seltos'],['make'=>'Kia','model'=>'Sorento'],['make'=>'Kia','model'=>'Soul'],['make'=>'Kia','model'=>'Sportage'],['make'=>'Kia','model'=>'Stinger'],['make'=>'Kia','model'=>'Telluride'],
                ['make'=>'Land Rover','model'=>'Defender'],['make'=>'Land Rover','model'=>'Discovery'],['make'=>'Land Rover','model'=>'Discovery Sport'],['make'=>'Land Rover','model'=>'Range Rover'],['make'=>'Land Rover','model'=>'Range Rover Evoque'],['make'=>'Land Rover','model'=>'Range Rover Sport'],['make'=>'Land Rover','model'=>'Range Rover Velar'],
                ['make'=>'Lexus','model'=>'ES'],['make'=>'Lexus','model'=>'GS'],['make'=>'Lexus','model'=>'GX'],['make'=>'Lexus','model'=>'IS'],['make'=>'Lexus','model'=>'LC'],['make'=>'Lexus','model'=>'LS'],['make'=>'Lexus','model'=>'LX'],['make'=>'Lexus','model'=>'NX'],['make'=>'Lexus','model'=>'RC'],['make'=>'Lexus','model'=>'RX'],['make'=>'Lexus','model'=>'RZ'],['make'=>'Lexus','model'=>'TX'],['make'=>'Lexus','model'=>'UX'],
                ['make'=>'Lincoln','model'=>'Aviator'],['make'=>'Lincoln','model'=>'Continental'],['make'=>'Lincoln','model'=>'Corsair'],['make'=>'Lincoln','model'=>'MKZ'],['make'=>'Lincoln','model'=>'Nautilus'],['make'=>'Lincoln','model'=>'Navigator'],['make'=>'Lincoln','model'=>'Navigator L'],
                ['make'=>'Lucid','model'=>'Air'],
                ['make'=>'Maserati','model'=>'Ghibli'],['make'=>'Maserati','model'=>'Grecale'],['make'=>'Maserati','model'=>'GranTurismo'],['make'=>'Maserati','model'=>'Levante'],['make'=>'Maserati','model'=>'Quattroporte'],
                ['make'=>'Mazda','model'=>'3'],['make'=>'Mazda','model'=>'6'],['make'=>'Mazda','model'=>'CX-3'],['make'=>'Mazda','model'=>'CX-30'],['make'=>'Mazda','model'=>'CX-5'],['make'=>'Mazda','model'=>'CX-50'],['make'=>'Mazda','model'=>'CX-9'],['make'=>'Mazda','model'=>'CX-90'],['make'=>'Mazda','model'=>'MX-5 Miata'],['make'=>'Mazda','model'=>'MX-30'],
                ['make'=>'McLaren','model'=>'720S'],['make'=>'McLaren','model'=>'750S'],['make'=>'McLaren','model'=>'Artura'],['make'=>'McLaren','model'=>'GT'],
                ['make'=>'Mercedes-Benz','model'=>'A-Class'],['make'=>'Mercedes-Benz','model'=>'AMG GT'],['make'=>'Mercedes-Benz','model'=>'C-Class'],['make'=>'Mercedes-Benz','model'=>'CLA-Class'],['make'=>'Mercedes-Benz','model'=>'CLE'],['make'=>'Mercedes-Benz','model'=>'E-Class'],['make'=>'Mercedes-Benz','model'=>'EQB'],['make'=>'Mercedes-Benz','model'=>'EQE'],['make'=>'Mercedes-Benz','model'=>'EQS'],['make'=>'Mercedes-Benz','model'=>'G-Class'],['make'=>'Mercedes-Benz','model'=>'GLA-Class'],['make'=>'Mercedes-Benz','model'=>'GLB-Class'],['make'=>'Mercedes-Benz','model'=>'GLC-Class'],['make'=>'Mercedes-Benz','model'=>'GLE-Class'],['make'=>'Mercedes-Benz','model'=>'GLS-Class'],['make'=>'Mercedes-Benz','model'=>'S-Class'],['make'=>'Mercedes-Benz','model'=>'SL-Class'],['make'=>'Mercedes-Benz','model'=>'Sprinter'],
                ['make'=>'MINI','model'=>'Clubman'],['make'=>'MINI','model'=>'Cooper'],['make'=>'MINI','model'=>'Cooper Countryman'],['make'=>'MINI','model'=>'Countryman'],['make'=>'MINI','model'=>'Hardtop 2 Door'],['make'=>'MINI','model'=>'Hardtop 4 Door'],
                ['make'=>'Mitsubishi','model'=>'Eclipse Cross'],['make'=>'Mitsubishi','model'=>'Galant'],['make'=>'Mitsubishi','model'=>'Lancer'],['make'=>'Mitsubishi','model'=>'Mirage'],['make'=>'Mitsubishi','model'=>'Outlander'],['make'=>'Mitsubishi','model'=>'Outlander PHEV'],['make'=>'Mitsubishi','model'=>'Outlander Sport'],
                ['make'=>'Nissan','model'=>'Altima'],['make'=>'Nissan','model'=>'ARIYA'],['make'=>'Nissan','model'=>'Armada'],['make'=>'Nissan','model'=>'Frontier'],['make'=>'Nissan','model'=>'GT-R'],['make'=>'Nissan','model'=>'Kicks'],['make'=>'Nissan','model'=>'LEAF'],['make'=>'Nissan','model'=>'Maxima'],['make'=>'Nissan','model'=>'Murano'],['make'=>'Nissan','model'=>'Pathfinder'],['make'=>'Nissan','model'=>'Rogue'],['make'=>'Nissan','model'=>'Sentra'],['make'=>'Nissan','model'=>'Titan'],['make'=>'Nissan','model'=>'Versa'],['make'=>'Nissan','model'=>'Z'],
                ['make'=>'Polestar','model'=>'2'],['make'=>'Polestar','model'=>'3'],
                ['make'=>'Porsche','model'=>'718 Boxster'],['make'=>'Porsche','model'=>'718 Cayman'],['make'=>'Porsche','model'=>'911'],['make'=>'Porsche','model'=>'Boxster'],['make'=>'Porsche','model'=>'Cayenne'],['make'=>'Porsche','model'=>'Cayenne Coupe'],['make'=>'Porsche','model'=>'Cayman'],['make'=>'Porsche','model'=>'Macan'],['make'=>'Porsche','model'=>'Panamera'],['make'=>'Porsche','model'=>'Taycan'],
                ['make'=>'Ram','model'=>'1500'],['make'=>'Ram','model'=>'2500'],['make'=>'Ram','model'=>'3500'],['make'=>'Ram','model'=>'ProMaster Cargo Van'],['make'=>'Ram','model'=>'ProMaster City'],
                ['make'=>'Rivian','model'=>'R1S'],['make'=>'Rivian','model'=>'R1T'],
                ['make'=>'Rolls-Royce','model'=>'Cullinan'],['make'=>'Rolls-Royce','model'=>'Ghost'],['make'=>'Rolls-Royce','model'=>'Phantom'],['make'=>'Rolls-Royce','model'=>'Spectre'],['make'=>'Rolls-Royce','model'=>'Wraith'],
                ['make'=>'Subaru','model'=>'Ascent'],['make'=>'Subaru','model'=>'BRZ'],['make'=>'Subaru','model'=>'Crosstrek'],['make'=>'Subaru','model'=>'Forester'],['make'=>'Subaru','model'=>'Impreza'],['make'=>'Subaru','model'=>'Legacy'],['make'=>'Subaru','model'=>'Outback'],['make'=>'Subaru','model'=>'Solterra'],['make'=>'Subaru','model'=>'WRX'],
                ['make'=>'Tesla','model'=>'Cybertruck'],['make'=>'Tesla','model'=>'Model 3'],['make'=>'Tesla','model'=>'Model S'],['make'=>'Tesla','model'=>'Model X'],['make'=>'Tesla','model'=>'Model Y'],['make'=>'Tesla','model'=>'Roadster'],
                ['make'=>'Toyota','model'=>'4Runner'],['make'=>'Toyota','model'=>'Avalon'],['make'=>'Toyota','model'=>'bZ4X'],['make'=>'Toyota','model'=>'Camry'],['make'=>'Toyota','model'=>'Camry Hybrid'],['make'=>'Toyota','model'=>'Corolla'],['make'=>'Toyota','model'=>'Corolla Cross'],['make'=>'Toyota','model'=>'Corolla Hybrid'],['make'=>'Toyota','model'=>'Crown'],['make'=>'Toyota','model'=>'FJ Cruiser'],['make'=>'Toyota','model'=>'GR Supra'],['make'=>'Toyota','model'=>'GR86'],['make'=>'Toyota','model'=>'Grand Highlander'],['make'=>'Toyota','model'=>'Highlander'],['make'=>'Toyota','model'=>'Land Cruiser'],['make'=>'Toyota','model'=>'Mirai'],['make'=>'Toyota','model'=>'Prius'],['make'=>'Toyota','model'=>'Prius Prime'],['make'=>'Toyota','model'=>'RAV4'],['make'=>'Toyota','model'=>'RAV4 Hybrid'],['make'=>'Toyota','model'=>'RAV4 Prime'],['make'=>'Toyota','model'=>'Sequoia'],['make'=>'Toyota','model'=>'Sienna'],['make'=>'Toyota','model'=>'Tacoma'],['make'=>'Toyota','model'=>'Tundra'],['make'=>'Toyota','model'=>'Venza'],
                ['make'=>'Volkswagen','model'=>'Arteon'],['make'=>'Volkswagen','model'=>'Atlas'],['make'=>'Volkswagen','model'=>'Atlas Cross Sport'],['make'=>'Volkswagen','model'=>'Beetle'],['make'=>'Volkswagen','model'=>'Golf'],['make'=>'Volkswagen','model'=>'Golf GTI'],['make'=>'Volkswagen','model'=>'Golf R'],['make'=>'Volkswagen','model'=>'ID.4'],['make'=>'Volkswagen','model'=>'ID. Buzz'],['make'=>'Volkswagen','model'=>'Jetta'],['make'=>'Volkswagen','model'=>'Passat'],['make'=>'Volkswagen','model'=>'Taos'],['make'=>'Volkswagen','model'=>'Tiguan'],['make'=>'Volkswagen','model'=>'Touareg'],
                ['make'=>'Volvo','model'=>'C40 Recharge'],['make'=>'Volvo','model'=>'EX30'],['make'=>'Volvo','model'=>'EX90'],['make'=>'Volvo','model'=>'S60'],['make'=>'Volvo','model'=>'S90'],['make'=>'Volvo','model'=>'V60'],['make'=>'Volvo','model'=>'V90'],['make'=>'Volvo','model'=>'XC40'],['make'=>'Volvo','model'=>'XC40 Recharge'],['make'=>'Volvo','model'=>'XC60'],['make'=>'Volvo','model'=>'XC90'],
            ];

            $rows = array_map(fn($r) => array_merge($r, ['created_at' => $now, 'updated_at' => $now]), $data);
            foreach (array_chunk($rows, 50) as $chunk) {
                \Illuminate\Support\Facades\DB::table('car_makes_models')->insert($chunk);
            }

            return response()->json(['status' => 'success', 'message' => 'Car makes/models seeded successfully. Count: ' . count($data)]);
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

    public function getAdminZipcodes(Request $request)
    {
        $perPage = $request->query('perPage', 100);
        $search = $request->query('search');

        $query = UsaZipcode::query();

        if ($search) {
            $query->where('zip', 'like', "%$search%")
                  ->orWhere('city', 'like', "%$search%")
                  ->orWhere('state_name', 'like', "%$search%");
        }

        $zipcodes = $query->orderBy('state_name')->orderBy('city')->paginate($perPage);
        return response()->json($zipcodes);
    }
}


