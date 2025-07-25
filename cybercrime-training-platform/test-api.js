const http = require('http');

console.log('Testing API connection to http://localhost:5000/api/test');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/test',
  method: 'GET',
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('RESPONSE BODY:');
    console.log(data);
    console.log('\nConnection test successful!');
  });
});

req.on('error', (e) => {
  console.error(`Connection error: ${e.message}`);
  console.error('This could be due to:');
  console.error('1. The server is not running');
  console.error('2. The server is not listening on port 5000');
  console.error('3. A firewall is blocking the connection');
  console.error('4. The server is not accessible from this machine');
});

req.end();

// Also try with a timeout to see if it's just slow
setTimeout(() => {
  console.log('\nTrying again with a longer timeout...');
  
  const req2 = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('RESPONSE BODY:');
      console.log(data);
      console.log('\nConnection test successful with longer timeout!');
    });
  });
  
  req2.on('error', (e) => {
    console.error(`Connection error with longer timeout: ${e.message}`);
  });
  
  req2.setTimeout(10000); // 10 second timeout
  req2.end();
}, 2000);