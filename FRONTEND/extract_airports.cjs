const xlsx = require('xlsx'); 
const fs = require('fs');

try {
    const workbook = xlsx.readFile('f:/Desipath-code/Flight list_updated.xlsx'); 
    const sheet = workbook.Sheets[workbook.SheetNames[0]]; 
    const data = xlsx.utils.sheet_to_json(sheet); 
    
    const php = data.map(r => {
        const iata = r.Code || r.iata_code || r.IATA || r['IATA Code'] || '';
        const name = r['Airport Name'] || r.airport_name || r.Airport || '';
        const city = r.City || r.city || '';
        const region = r.State || r.region || r.region || '';
        const country = r.Country || r.country || '';
        return `            ['iata_code' => '${iata}', 'airport_name' => '${String(name).replace(/'/g, "\\'")}', 'city' => '${String(city).replace(/'/g, "\\'")}', 'region' => '${String(region).replace(/'/g, "\\'")}', 'country' => '${String(country).replace(/'/g, "\\'")}']`;
    }).join(',\n'); 
    
    fs.writeFileSync('f:/Desipath-code/airports_array.txt', php);
    console.log('Success: airports_array.txt created');
} catch (e) {
    console.error(e);
}
