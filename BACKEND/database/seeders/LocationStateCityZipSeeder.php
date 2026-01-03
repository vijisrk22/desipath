<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\LocationStateCityZip;

class LocationStateCityZipSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $file = storage_path('app/locationstatecityzip.csv');
        if (!file_exists($file)) {
            echo "CSV file not found.\n";
            return;
        }

        $handle = fopen($file, 'r');
        $header = fgetcsv($handle); // skip header

        while (($data = fgetcsv($handle)) !== false) {
            // Fix ZIP: always make it 5 characters with leading 0s
            // $zip = sprintf('%05s', trim($data[0]));
            $zip = str_pad($data[0], 5, '0', STR_PAD_LEFT);

            LocationStateCityZip::create([
                'zip' => $zip,
                'city' => $data[1],
                'state_id' => $data[2],
                'state_name' => $data[3],
                'stateID_state_name' => $data[4],
                'timezone' => $data[5],
                'lat' => $data[6],
                'lng' => $data[7],
                'country' => $data[8] ?? 'USA',
            ]);
        }

        fclose($handle);
    }
}
