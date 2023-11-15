const http = require('http');
const fs = require('fs');
const port = 3000;

const responseMappings = {
  'GET:/api/mockdata': '/mocks/data.json',
  'GET:/kyc-module/v1.0/configs/s4tvvonz740203/value?configName=AUTO_KYC_VALIDATION': {"value":true},
  'GET:/kyc-module/v1.0/configs/s4tvvonz740203/value?configName=AUTO_KYC_VERIFICATION': {"value":true},
  'GET:/kyc-module/verification/v1.2/players/s4tvvonz740203': {"data":{"code":0}},
  'POST:/kyc-module/verification/v1.2/players/s4tvvonz740203': {"data": {"code": 1, "description": "E-KYC Light"}},
  'GET:/kyc-module/verification/v1.2/statuses': '/mocks/verificationStatuses.json',
  'GET:/kyc-module/v1.1/kycdocverification/s4tvvonz740203/verificationType' : '/mocks/kyc-module-verificationType.json',
  'GET:/kyc-module/fsbo/history?playerToken=s4tvvonz740203&page=0&size=100' : "/mocks/kycDocumentsHistory.json",
  'GET:/kyc-module/fsbo/requestableDocuments?playerToken=s4tvvonz740203' : "/mocks/kyc-module-requestableDocuments.json",
  'GET:/kyc-module/fsbo/requestableDocument?playerToken=s4tvvonz740203&id=6' : "/mocks/kyc-module-requestableDocument_6.json",
  'GET:/kyc-module/fsbo/requestableDocument?playerToken=s4tvvonz740203&id=1' : "/mocks/kyc-module-requestableDocument_1.json",
  'POST:/player-module/player/read?playertoken=s4tvvonz740203': "/mocks/player-module__player.json",
  'GET:/player-module/v2/players?q=s4tvvonz740203' : "/mocks/player-module-v2-players.json"
};

const server = http.createServer((req, res) => {
  try {
    const urlPath = req.url;
    const requestMethod = req.method;

    console.log(`${getCurrentTime()} - ${requestMethod} ${urlPath}`);

    if (`${req.method}:${urlPath}` in responseMappings) {
      const response = responseMappings[`${req.method}:${urlPath}`];

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
