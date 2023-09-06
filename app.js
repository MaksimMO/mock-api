const http = require('http');
const fs = require('fs');
const port = 3000;

const responseMappings = {
  '/api/mockdata': 'data.json',
  '/player-module/player/read?playertoken=s4lbocmz973509': "player-module__player.json",
  '/kyc-module/v1.0/configs/ngdtqg496134/value?configName=AUTO_KYC_VALIDATION': {"value":true},
  '/kyc-module/v1.0/configs/ngdtqg496134/value?configName=AUTO_KYC_VERIFICATION': {"value":true},
  '/kyc-module/verification/v1.2/players/ngdtqg496134': {"data":{"code":0}},
  '/kyc-module/v1.1/kycdocverification/ngdtqg496134/verificationType' : 'kyc-module-verificationType.json',
  '/kyc-module/fsbo/history?playerToken=s4lbocmz973509&page=0&size=100' : "kycDocumentsHistory.json"
};

const server = http.createServer((req, res) => {
  try {
    const urlPath = req.url;

    console.log(`${getCurrentTime()} - ${urlPath}`);

    if (urlPath in responseMappings) {
      const response = responseMappings[urlPath];

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });

      if (typeof response === 'string' && response.endsWith('.json')) {
        // If the response is a file path ending with .json, read and stream the file
        const filePath = `${__dirname}/${response}`;
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
      } else {
        // If the response is a plain object, stringify and send it
        res.end(JSON.stringify(response));
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  }
  catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}
