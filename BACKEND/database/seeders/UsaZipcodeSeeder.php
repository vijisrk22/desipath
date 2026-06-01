<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\UsaZipcode;
use ZipArchive;
use XMLReader;

class UsaZipcodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Truncate the table before seeding to prevent duplicates
        $this->command->info("Truncating UsaZipcode table...");
        \App\Models\UsaZipcode::truncate();

        // Priority: .csv, then .xlsx, then .zip
        $csvPath = storage_path('app/USA_Zipcode_table.csv');
        $xlsxPath = storage_path('app/USA_Zipcode_table.xlsx');
        $zipPath = storage_path('app/USA_Zipcode_table.zip');

        if (file_exists($csvPath)) {
            $this->command->info("Parsing CSV data from: $csvPath");
            $this->seedFromCsv($csvPath);
        } elseif (file_exists($xlsxPath)) {
            $this->command->info("Parsing Excel (.xlsx) data from: $xlsxPath");
            $this->seedFromZip($xlsxPath);
        } elseif (file_exists($zipPath)) {
            $this->command->info("Parsing Excel (ZIP) data from: $zipPath");
            $this->seedFromZip($zipPath);
        } else {
            $this->command->error("No seed file found.");
        }
    }

    private function seedFromCsv($filePath)
    {
        if (($handle = fopen($filePath, "r")) !== FALSE) {
            $batchSize = 1000;
            $batch = [];
            $count = 0;
            $headerMatched = false;

            while (($row = fgetcsv($handle, 1000, ",")) !== FALSE) {
                if (!$headerMatched && (strtolower($row[0]) === 'zip' || strtolower($row[1]) === 'city')) {
                    $headerMatched = true;
                    continue;
                }

                if (isset($row[0]) && !empty($row[0])) {
                    $batch[] = [
                        'zip' => str_pad((string)$row[0], 5, '0', STR_PAD_LEFT),
                        'city' => $row[1] ?? null,
                        'state_id' => $row[2] ?? null,
                        'state_name' => $row[3] ?? null,
                        'lat' => isset($row[6]) ? (float)$row[6] : null,
                        'lng' => isset($row[7]) ? (float)$row[7] : null,
                        'timezone' => $row[5] ?? null,
                        'country' => $row[8] ?? 'US',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                    $count++;
                    if (count($batch) >= $batchSize) {
                        \App\Models\UsaZipcode::insert($batch);
                        $batch = [];
                        $this->command->info("Seeded $count records...");
                    }
                }
            }
            if (!empty($batch)) { \App\Models\UsaZipcode::insert($batch); }
            fclose($handle);
            $this->command->info("CSV Seeding completed! Total records: $count");
        }
    }

    private function seedFromZip($filePath)
    {
        $zip = new \ZipArchive;
        if ($zip->open($filePath) === TRUE) {
            $sharedStrings = [];
            $xmlString = $zip->getFromName('xl/sharedStrings.xml');
            if ($xmlString) {
                $reader = new \XMLReader(); $reader->xml($xmlString);
                while ($reader->read()) {
                    if ($reader->nodeType == \XMLReader::ELEMENT && $reader->name === 't') {
                        $sharedStrings[] = $reader->readInnerXML();
                    }
                }
                $reader->close();
            }

            $sheetXml = $zip->getFromName('xl/worksheets/sheet1.xml');
            if ($sheetXml) {
                $reader = new \XMLReader(); $reader->xml($sheetXml);
                $batchSize = 250; $batch = []; $count = 0; $row = [];
                
                while ($reader->read()) {
                    if ($reader->nodeType == \XMLReader::ELEMENT && $reader->name === 'row') { $row = []; }
                    if ($reader->nodeType == \XMLReader::ELEMENT && $reader->name === 'c') {
                        $t = $reader->getAttribute('t');
                        $node = $reader->expand();
                        if ($node) {
                             $vNode = $node->getElementsByTagName('v')->item(0);
                             if ($vNode) {
                                 $val = $vNode->nodeValue;
                                 $row[] = ($t === 's') ? ($sharedStrings[(int)$val] ?? null) : $val;
                             }
                        }
                    }
                    if ($reader->nodeType == \XMLReader::END_ELEMENT && $reader->name === 'row') {
                        if (empty($row) || (strtolower($row[0] ?? '') === 'zip')) continue;
                        $batch[] = [
                            'zip' => str_pad((string)($row[0]??''), 5, '0', STR_PAD_LEFT),
                            'city' => $row[1] ?? null,
                            'state_id' => $row[2] ?? null,
                            'state_name' => $row[3] ?? null,
                            'lat' => isset($row[6]) ? (float)$row[6] : null,
                            'lng' => isset($row[7]) ? (float)$row[7] : null,
                            'timezone' => $row[5] ?? null,
                            'country' => $row[8] ?? 'US',
                            'created_at' => now(), 'updated_at' => now(),
                        ];
                        $count++;
                        if (count($batch) >= $batchSize) {
                            \App\Models\UsaZipcode::insert($batch); $batch = [];
                            $this->command->info("Seeded $count records from Excel...");
                        }
                    }
                }
                if (!empty($batch)) { \App\Models\UsaZipcode::insert($batch); }
                $reader->close();
            }
            $zip->close();
            $this->command->info("Excel Seeding completed! Total records: $count");
        }
    }
}
