const https = require('https');
const httpProxy = require('http-proxy');
const fs = require('fs');

const targetDomain = 'https://jira.gamesys.co.uk/';
const proxy = httpProxy.createProxyServer({
  target: 'https://jira.gamesys.co.uk/',
  secure: false, // Add this option to disable certificate validation
});


const sslOptions = {
  key: fs.readFileSync('C:/Users/mmelnyk.SEO/key.pem'),
  cert: fs.readFileSync('C:/Users/mmelnyk.SEO/cert.pem'),
};

const server = https.createServer(sslOptions, (req, res) => {
  console.log(`Proxying request to: ${targetDomain}${req.url}`);
  proxy.web(req, res, { target: targetDomain });
});

server.on('error', (err) => {
  console.error('Proxy server error:');
  console.error(err);
});

server.listen(443, () => {
  console.log('HTTPS proxy server is running on https://localhost:443');
});
