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
        // Path to the renamed XLSX (ZIP) file
        $filePath = storage_path('app/USA_Zipcode_table.zip');

        if (!file_exists($filePath)) {
            $this->command->error("File not found: $filePath");
            return;
        }

        $zip = new ZipArchive;
        if ($zip->open($filePath) === TRUE) {
            $this->command->info("Extracting and parsing Excel data...");

            // 1. Parse Shared Strings
            $sharedStrings = [];
            $xmlString = $zip->getFromName('xl/sharedStrings.xml');
            if ($xmlString) {
                $reader = new XMLReader();
                $reader->xml($xmlString);
                while ($reader->read()) {
                    if ($reader->nodeType == XMLReader::ELEMENT && $reader->name === 't') {
                        $sharedStrings[] = $reader->readInnerXML();
                    }
                }
                $reader->close();
            }
            $this->command->info("Loaded " . count($sharedStrings) . " shared strings.");

            // 2. Parse Sheet 1
            $sheetXml = $zip->getFromName('xl/worksheets/sheet1.xml');
            if ($sheetXml) {
                // We use distinct temporary file to save memory if sheet is huge, 
                // but usually simpler to just stream from string if memory allows (10MB string is fine).
                // Or stream via wrapper.
                
                // For simplicity, let's try XMLReader on string.
                $reader = new XMLReader();
                $reader->xml($sheetXml);

                $batchSize = 200;
                $batch = [];
                $count = 0;
                
                // Map column letters to indices (0-based) for consistency
                // A=0, B=1, ... G=6
                // zip, lat, lng, city, state_id, state_name, timezone
                
                $row = [];
                // Simple parsing logic: access <row>, then <c>
                
                while ($reader->read()) {
                    if ($reader->nodeType == XMLReader::ELEMENT && $reader->name === 'row') {
                        $row = []; // Reset row
                    }
                    
                    if ($reader->nodeType == XMLReader::ELEMENT && $reader->name === 'c') {
                        $r = $reader->getAttribute('r'); // e.g. A1, B2
                        $t = $reader->getAttribute('t'); // 's' for shared string
                        
                        // Extract column index from 'r'
                        preg_match('/^([A-Z]+)/', $r, $matches);
                        $colLetter = $matches[1] ?? 'A';
                        $colIndex = 0;
                        if ($colLetter == 'A') $colIndex = 0;
                        elseif ($colLetter == 'B') $colIndex = 1;
                        elseif ($colLetter == 'C') $colIndex = 2;
                        elseif ($colLetter == 'D') $colIndex = 3;
                        elseif ($colLetter == 'E') $colIndex = 4;
                        elseif ($colLetter == 'F') $colIndex = 5;
                        elseif ($colLetter == 'G') $colIndex = 6;
                        else continue; // Skip other cols
                        
                        // Read value
                        // <c><v>123</v></c>
                        // Move to <v>
                        $value = null;
                        
                        // We need to read until end of <c> or find <v> or <t> (inline string)
                        // This manual XMLReader loop is tricky.
                        // Let's simplified approach: expand <c> node.
                        $node = $reader->expand(); // DOMNode
                        if ($node) {
                             $vNode = $node->getElementsByTagName('v')->item(0);
                             if ($vNode) {
                                 $val = $vNode->nodeValue;
                                 if ($t === 's') {
                                     $value = $sharedStrings[(int)$val] ?? null;
                                 } else {
                                     $value = $val;
                                 }
                             }
                             $tNode = $node->getElementsByTagName('t')->item(0); // Inline string keys
                             if ($tNode) {
                                 $value = $tNode->nodeValue;
                             }
                             
                             $row[$colIndex] = $value;
                        }
                    }
                    
                    if ($reader->nodeType == XMLReader::END_ELEMENT && $reader->name === 'row') {
                        // Process row
                        if (empty($row)) continue;
                        
                        // Check header row (zip, lat, etc.)
                        if (($row[0] ?? '') === 'zip') continue; 
                        
                        // Prepare data
                        if (isset($row[0])) {
                            $batch[] = [
                                'zip' => (string)$row[0],
                                'lat' => isset($row[1]) ? (float)$row[1] : null,
                                'lng' => isset($row[2]) ? (float)$row[2] : null,
                                'city' => $row[3] ?? null,
                                'state_id' => $row[4] ?? null,
                                'state_name' => $row[5] ?? null,
                                'timezone' => $row[6] ?? null,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ];
                            
                            $count++;
                            
                            if (count($batch) >= $batchSize) {
                                UsaZipcode::insert($batch);
                                $batch = [];
                                $this->command->info("Seeded $count records...");
                            }
                        }
                    }
                }
                
                if (!empty($batch)) {
                    UsaZipcode::insert($batch);
                }
                
                $reader->close();
            }
            
            $zip->close();
            $this->command->info("Seeding completed! Total records: $count");
        } else {
             $this->command->error("Failed to open ZIP file.");
        }
    }
}
