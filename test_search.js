const http = require('http');

const data = JSON.stringify({
  city: '',
  state: '',
  zipcode: '08540',
  priceMin: 0,
  priceMax: 5000000,
  homeType: []
});

const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/api/homes/search',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Response:', body.substring(0, 1000)));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
