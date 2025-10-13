// api/debug-response.js
// Simple endpoint to fetch the last saved CollabWORK response from /tmp
// NOTE: /tmp is ephemeral in Vercel. This only works if the same serverless
//       function instance is still warm after the webhook wrote the file.

const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  try {
    const filePath = path.join('/tmp', 'collabwork-response.json');
    const data = fs.readFileSync(filePath, 'utf8');

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(data);
  } catch (err) {
    console.error('Error reading /tmp file:', err?.message || err);
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'No saved response available' }));
  }
};
