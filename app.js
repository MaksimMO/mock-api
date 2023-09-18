const http = require('http');
const fs = require('fs');
const port = 3000;

const responseMappings = {
  '/api/mockdata': 'data.json',
  '/kyc-module/v1.0/configs/s4lbocmz973509/value?configName=AUTO_KYC_VALIDATION': {"value":true},
  '/kyc-module/v1.0/configs/s4lbocmz973509/value?configName=AUTO_KYC_VERIFICATION': {"value":true},
  '/kyc-module/verification/v1.2/players/s4lbocmz973509': {"data":{"code":0}},
  '/kyc-module/v1.1/kycdocverification/s4lbocmz973509/verificationType' : '/mocks/kyc-module-verificationType.json',
  '/kyc-module/fsbo/history?playerToken=s4lbocmz973509&page=0&size=100' : "/mocks/kycDocumentsHistory.json",
  '/kyc-module/fsbo/requestableDocuments?playerToken=s4lbocmz973509' : "/mocks/kyc-module-requestableDocuments.json",
  '/kyc-module/fsbo/requestableDocuments?playerToken=madona555555' : "/mocks/kyc-module-requestableDocuments2.json",
  '/player-module/player/read?playertoken=s4lbocmz973509': "/mocks/player-module__player.json",
  '/player-module/v2/players?q=s4lbocmz973509' : "/mocks/player-module-v2-players.json"
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
