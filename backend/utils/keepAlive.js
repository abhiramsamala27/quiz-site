const https = require('https');

/**
 * Pings the server to keep it awake on platforms like Render (free tier)
 * @param {string} url The URL to ping
 */
const keepAlive = (url) => {
  if (!url) {
    console.log('⚠️ Keep-alive URL not provided. Skipping...');
    return;
  }

  console.log(`🚀 Keep-alive initialized for: ${url}`);
  
  // Ping every 14 minutes (Render sleeps after 15 mins of inactivity)
  setInterval(() => {
    https.get(url, (res) => {
      console.log(`📡 Keep-alive ping sent to ${url} - Status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error(`❌ Keep-alive error: ${err.message}`);
    });
  }, 14 * 60 * 1000);
};

module.exports = keepAlive;
