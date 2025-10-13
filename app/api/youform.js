// api/youform.js
// Serverless endpoint for Youform webhooks -> CollabWORK Jobs search
// - Builds a plain-text query from the submission
// - Calls CollabWORK JobSearchKW
// - Saves the response to /tmp for quick debugging
// - Returns the jobs to the caller

const fs = require('fs');
const path = require('path');

/** Recursively collect all string values from an object/array */
function collectStrings(input, out = []) {
  if (input == null) return out;
  if (typeof input === 'string') {
    const s = input.trim();
    if (s) out.push(s);
    return out;
  }
  if (Array.isArray(input)) {
    for (const v of input) collectStrings(v, out);
    return out;
  }
  if (typeof input === 'object') {
    for (const k of Object.keys(input)) collectStrings(input[k], out);
    return out;
  }
  return out;
}

/** Read raw body if req.body is unavailable */
async function readRawBody(req) {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const raw = Buffer.concat(buffers).toString('utf8');
  try {
    return JSON.parse(raw);
  } catch {
    return raw; // fallback
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Method not allowed' }));
    return;
  }

  try {
    // Get JSON body (use raw fallback if needed)
    let payload = req.body;
    if (!payload) {
      payload = await readRawBody(req);
    }

    console.log('Received Youform webhook:');
    try { console.log(JSON.stringify(payload, null, 2)); } catch {}

    // Build plain-text query from all string values (deep)
    const parts = collectStrings(payload);
    const query = parts.join(' ').replace(/\s+/g, ' ').trim();
    console.log('Constructed search query:', query || '(empty)');

    // Prepare CollabWORK call
    const endpoint =
      process.env.COLLABWORK_ENDPOINT ||
      'https://api.collabwork.com/api:partners/JobSearchKW';
    const apiKey = process.env.COLLABWORK_API_KEY;

    let collabworkResponse = null;
    let collabworkStatus = null;
    let collabworkUrl = null;

    if (!query) {
      console.warn('No query constructed from payload; skipping API call.');
    } else if (!apiKey) {
      console.warn('COLLABWORK_API_KEY is not set; skipping API call.');
    } else {
      collabworkUrl = `${endpoint}?query=${encodeURIComponent(query)}`;
      console.log('Requesting CollabWORK jobs from:', collabworkUrl);

      // Node 18 runtime on Vercel has global fetch
      const resp = await fetch(collabworkUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      collabworkStatus = resp.status;
      // Try to parse JSON, fall back to text
      const text = await resp.text();
      try {
        collabworkResponse = JSON.parse(text);
      } catch {
        collabworkResponse = { raw: text };
      }

      console.log('CollabWORK status:', collabworkStatus);
      try { console.log('CollabWORK response:', JSON.stringify(collabworkResponse, null, 2)); } catch {}
    }

    // Save response to /tmp for quick debugging (ephemeral)
    let savedFilePath = null;
    if (collabworkResponse) {
      const filePath = path.join('/tmp', 'collabwork-response.json');
      try {
        fs.writeFileSync(filePath, JSON.stringify(collabworkResponse, null, 2), 'utf8');
        savedFilePath = filePath;
        console.log('Saved response to', filePath);
      } catch (e) {
        console.warn('Failed to save /tmp file:', e?.message || e);
      }
    }

    // Return a structured result
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify(
        {
          status: 'ok',
          queryProcessed: Boolean(query),
          endpoint: collabworkUrl || null,
          upstreamStatus: collabworkStatus,
          savedFilePath, // lives only while the function instance is warm
          jobs: collabworkResponse || null,
        },
        null,
        2
      )
    );
  } catch (err) {
    console.error('Error handling Youform webhook:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
};
