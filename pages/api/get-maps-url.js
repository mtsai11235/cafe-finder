/**
 * API endpoint to generate a Google Maps API URL with the secure API key
 */
import { setCorsHeaders, handleOptions, validateMethod, getApiKey, handleError } from '../../lib/api-utils';

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
    
    // Get callback and libraries from query parameters or use defaults
    const callback = req.query.callback || 'initMap';
    const libraries = req.query.libraries || 'places';
    
    // Generate the Google Maps API URL with the API key
    const mapsUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries}&callback=${callback}`;
    
    // Return the URL in the response
    res.status(200).json({ url: mapsUrl });
    
  } catch (error) {
    handleError(res, error, 'An error occurred while generating the Maps URL.');
  }
}
