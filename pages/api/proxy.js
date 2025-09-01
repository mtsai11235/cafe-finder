/**
 * Proxy endpoint for Google Maps API requests
 * This keeps our API key secure on the server side
 */
import https from 'https';
import { setCorsHeaders, handleOptions, validateMethod, getApiKey, handleError } from '../../lib/api-utils';

// Valid Google Maps API endpoints that can be proxied
const VALID_ENDPOINTS = [
  'maps/api/place/nearbysearch/json',
  'maps/api/place/details/json',
  'maps/api/place/textsearch/json',
  'maps/api/geocode/json'
];

export default async function handler(req, res) {
  try {
    // Set CORS headers
    setCorsHeaders(res);
    
    // Handle OPTIONS request (preflight)
    if (handleOptions(req, res)) return;
    
    // Validate request method
    if (!validateMethod(req, res, ['GET'])) return;

    // Get API key with validation
    const apiKey = getApiKey(res);
    if (!apiKey) return;
    
    // Get the endpoint and parameters from the request
    const endpoint = req.query.endpoint;
    const params = { ...req.query };
    
    // Remove the endpoint parameter as it's not needed for the actual Google API call
    delete params.endpoint;
    
    // Add the API key to the parameters
    params.key = apiKey;
    
    // Validate the endpoint
    if (!endpoint || !VALID_ENDPOINTS.includes(endpoint)) {
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
    handleError(res, error, 'Error proxying request to Google Maps API');
  }
}

/**
 * Helper function to fetch data from Google Maps API
 * @param {string} requestUrl - The full URL to request
 * @returns {Promise<object>} - Parsed JSON response
 */
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
          reject(new Error('Failed to parse Google Maps API response'));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Failed to connect to Google Maps API: ${error.message}`));
    });
  });
}
