const xlsx = require('xlsx'); 
const fs = require('fs');

try {
    const workbook = xlsx.readFile('f:/Desipath-code/Flight list_updated.xlsx'); 
    const sheet = workbook.Sheets[workbook.SheetNames[0]]; 
    const data = xlsx.utils.sheet_to_json(sheet); 
    
    // Log headers to debug
    console.log('Headers:', Object.keys(data[0] || {}));

    const php = data.map(r => {
        const iata = r.iata_code || r.IATA || r['IATA Code'] || '';
        const name = r.airport_name || r.Airport || r['Airport Name'] || '';
        const city = r.city || r.City || '';
        const region = r.region || r.region || r.State || '';
        const country = r.country || r.Country || '';
        return `            ['iata_code' => '${iata}', 'airport_name' => '${name.replace(/'/g, "\\'")}', 'city' => '${city.replace(/'/g, "\\'")}', 'region' => '${region.replace(/'/g, "\\'")}', 'country' => '${country.replace(/'/g, "\\'")}']`;
    }).join(',\n'); 
    
    fs.writeFileSync('f:/Desipath-code/airports_array.txt', php);
    console.log('Success: airports_array.txt created');
} catch (e) {
    console.error(e);
}
