// Serverless function to proxy Google Maps API requests
// This keeps our API key secure on the server side

import https from 'https';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get API key from environment variable
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API key not configured',
        message: 'The Google Maps API key is not set in the environment variables.'
      });
    }
    
    // Get the endpoint and parameters from the request
    const endpoint = req.query.endpoint;
    const params = { ...req.query };
    
    // Remove the endpoint parameter as it's not needed for the actual Google API call
    delete params.endpoint;
    
    // Add the API key to the parameters
    params.key = apiKey;
    
    // Validate the endpoint
    const validEndpoints = [
      'maps/api/place/nearbysearch/json',
      'maps/api/place/details/json',
      'maps/api/place/textsearch/json',
      'maps/api/geocode/json'
    ];
    
    if (!endpoint || !validEndpoints.includes(endpoint)) {
      return res.status(400).json({ 
        error: 'Invalid endpoint',
        message: 'The requested endpoint is not supported.'
      });
    }
    
    // Build the Google Maps API URL
    const baseUrl = 'https://maps.googleapis.com/';
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    const requestUrl = `${baseUrl}${endpoint}?${queryString}`;
    
    // Make the request to Google Maps API
    const googleResponse = await fetchFromGoogleMaps(requestUrl);
    
    // Return the response from Google Maps API
    res.status(200).json(googleResponse);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy error',
      message: error.message
    });
  }
}

// Helper function to fetch data from Google Maps API
function fetchFromGoogleMaps(requestUrl) {
  return new Promise((resolve, reject) => {
    https.get(requestUrl, (response) => {
      let data = '';
      
      // A chunk of data has been received
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      // The whole response has been received
      response.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      });
      
    }).on('error', (error) => {
      reject(error);
    });
  });
}
