const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(data);
      });

      response.on('error', (error) => {
        reject(error);
      });
    });
  });
}

// Usage example (similar to previous example)
async function runExample() {
  const url = 'https://yuugado-com-eph-rdge-shared.eph.mt1-nonprod.enjoy-platform.net'; // Replace with your desired URL

  try {
    const result = await fetchUrl(url);
    console.log('Response:', result);
  } catch (error) {
    console.error('Error fetching URL:', error.message);
  }
}

runExample();
