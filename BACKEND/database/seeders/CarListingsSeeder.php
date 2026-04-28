<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CarListingsSeeder extends Seeder
{
    public function run()
    {
        $users = [
            ['id' => 3, 'name' => 'Vijay Sam'],
            ['id' => 4, 'name' => 'Sam Rajesh'],
            ['id' => 5, 'name' => 'Ram Kumar'],
            ['id' => 6, 'name' => 'Binoy Varghese'],
            ['id' => 7, 'name' => 'Hilton Kumar'],
            ['id' => 8, 'name' => 'Muthu Kumar'],
            ['id' => 9, 'name' => 'Ferry Sam'],
            ['id' => 10, 'name' => 'Henry George'],
            ['id' => 11, 'name' => 'George John'],
            ['id' => 12, 'name' => 'Uma Desai'],
            ['id' => 13, 'name' => 'Paul Kumar'],
            ['id' => 14, 'name' => 'Wisley Kutty'],
            ['id' => 15, 'name' => 'Cathey Tommy'],
            ['id' => 16, 'name' => 'Daniel Shankar'],
        ];

        $cars = [
            ['make' => 'Toyota', 'model' => 'Camry', 'price' => 25000, 'features' => ['Bluetooth', 'Backup Camera', 'Cruise Control']],
            ['make' => 'Honda', 'model' => 'Civic', 'price' => 18000, 'features' => ['Sunroof', 'Apple CarPlay', 'Heated Seats']],
            ['make' => 'Ford', 'model' => 'F-150', 'price' => 45000, 'features' => ['4WD', 'Towing Package', 'Navigation']],
            ['make' => 'Tesla', 'model' => 'Model 3', 'price' => 35000, 'features' => ['Autopilot', 'Premium Audio', 'All-Glass Roof']],
            ['make' => 'BMW', 'model' => '3 Series', 'price' => 40000, 'features' => ['Leather Seats', 'Turbocharged', 'Sport Package']],
            ['make' => 'Audi', 'model' => 'A4', 'price' => 38000, 'features' => ['Quattro', 'Virtual Cockpit', 'Matrix LED']],
            ['make' => 'Mercedes', 'model' => 'C-Class', 'price' => 42000, 'features' => ['Panoramic Roof', 'Ambient Lighting', 'Burmester Sound']],
            ['make' => 'Chevrolet', 'model' => 'Silverado', 'price' => 32000, 'features' => ['Bed Liner', 'Z71 Off-Road', 'Remote Start']],
            ['make' => 'Nissan', 'model' => 'Altima', 'price' => 20000, 'features' => ['Blind Spot Monitoring', 'Dual Climate Control']],
            ['make' => 'Hyundai', 'model' => 'Sonata', 'price' => 22000, 'features' => ['Smart Cruise Control', 'Lane Keeping Assist']],
            ['make' => 'Kia', 'model' => 'Sportage', 'price' => 24000, 'features' => ['AWD', 'Power Liftgate', 'Keyless Entry']],
            ['make' => 'Subaru', 'model' => 'Outback', 'price' => 28000, 'features' => ['EyeSight', 'Roof Rails', 'Symmetrical AWD']],
            ['make' => 'Lexus', 'model' => 'RX', 'price' => 50000, 'features' => ['Mark Levinson Audio', 'Head-Up Display']],
            ['make' => 'Mazda', 'model' => 'CX-5', 'price' => 23000, 'features' => ['i-Activsense', 'Bose Speakers', 'Navigation']],
            ['make' => 'Jeep', 'model' => 'Grand Cherokee', 'price' => 35000, 'features' => ['Uconnect', 'Leather Seats', '4x4']],
        ];

        $zipcodes_data = DB::table('usa_zipcodes')->inRandomOrder()->limit(100)->get();
        $images = [
            '1.avif', '10.avif', '11.avif', '12.avif', '12c.avif', '1a.avif', '1c.avif', '1cc.avif', '1ff.avif', '1v.avif',
            '21.avif', '21c.avif', '3.avif', '4.avif', '4a.avif', '4c.avif', '5.avif', '6c.avif', '6g.avif', '8.avif',
            '8c.avif', '8cx.avif', 'a.avif', 'gff.avif'
        ];

        DB::table('BuySellCars')->truncate();

        foreach ($users as $user) {
            for ($i = 0; $i < 5; $i++) {
                $car = $cars[array_rand($cars)];
                $isDealer = (rand(0, 1) === 1);
                $loc = $zipcodes_data[array_rand($zipcodes_data->toArray())];
                
                $data = [
                    'make' => $car['make'],
                    'model' => $car['model'],
                    'year' => rand(2015, 2024),
                    'miles' => rand(5000, 100000),
                    'variant' => 'Standard',
                    'pictures' => json_encode(['storage/cars/' . $images[array_rand($images)]]),
                    'location' => 'USA',
                    'location_city' => $loc->city,
                    'location_state' => $loc->state_id,
                    'location_zipcode' => $loc->zip,
                    'latitude' => $loc->lat,
                    'longitude' => $loc->lng,
                    'seller_id' => $user['id'],
                    'price' => $car['price'] + rand(-2000, 5000),
                    'description' => 'A well-maintained ' . $car['make'] . ' ' . $car['model'] . ' with great features. No accidents.',
                    'is_dealer' => $isDealer,
                    'fuel_type_id' => ($car['make'] === 'Tesla') ? 2 : rand(1, 4),
                    'transmission_id' => rand(1, 3),
                    'condition_id' => rand(1, 3),
                    'drive_type' => (rand(0, 1) === 0) ? 'FWD' : 'AWD',
                    'mpg' => rand(20, 40) . '/' . rand(30, 50),
                    'vin' => strtoupper(bin2hex(random_bytes(8))),
                    'features' => json_encode($car['features']),
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ];

                if ($isDealer) {
                    $data['dealer_name'] = $user['name'] . ' Motors';
                    $data['dealer_zipcode'] = $loc->zip;
                    $data['dealer_contact_person'] = $user['name'];
                    $data['dealer_contact_number'] = '555-01' . rand(10, 99);
                    $data['dealer_email'] = strtolower(str_replace(' ', '', $user['name'])) . '@dealership.com';
                } else {
                    $data['owner_name'] = $user['name'];
                    $data['owner_contact_number'] = '555-02' . rand(10, 99);
                    $data['owner_contact'] = 'Call or text ' . $user['name'];
                }

                DB::table('BuySellCars')->insert($data);
            }
        }

        // Specifically add results for the user's test case: Marietta, Ohio (45750)
        // to ensure they see hits when testing the radius logic.
        $marietta = DB::table('usa_zipcodes')->where('zip', '45750')->first();
        if ($marietta) {
            foreach (array_slice($users, 0, 3) as $user) {
                $car = $cars[array_rand($cars)];
                $data = [
                    'make' => $car['make'],
                    'model' => $car['model'],
                    'year' => rand(2018, 2024),
                    'miles' => rand(5000, 40000),
                    'variant' => 'Standard',
                    'pictures' => json_encode(['storage/cars/' . $images[array_rand($images)]]),
                    'location' => 'USA',
                    'location_city' => $marietta->city,
                    'location_state' => $marietta->state_id,
                    'location_zipcode' => $marietta->zip,
                    'latitude' => $marietta->lat,
                    'longitude' => $marietta->lng,
                    'seller_id' => $user['id'],
                    'price' => $car['price'] + rand(-1000, 3000),
                    'description' => 'Great car located in Marietta. Very clean.',
                    'is_dealer' => false,
                    'owner_name' => $user['name'],
                    'owner_contact_number' => '555-03' . rand(10, 99),
                    'owner_contact' => 'Contact ' . $user['name'],
                    'fuel_type_id' => rand(1, 2),
                    'transmission_id' => 1,
                    'condition_id' => 1,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ];
                DB::table('BuySellCars')->insert($data);
            }
        }
    }
}
