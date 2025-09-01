/**
 * Shared utilities for API endpoints
 */

// Set standard CORS headers for all API responses
export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Handle OPTIONS requests (CORS preflight)
export function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

// Validate request method (only allow specified methods)
export function validateMethod(req, res, allowedMethods = ['GET']) {
  if (!allowedMethods.includes(req.method)) {
    res.status(405).json({ 
      error: 'Method not allowed',
      message: `This endpoint only supports ${allowedMethods.join(', ')} requests`
    });
    return false;
  }
  return true;
}

// Get API key from environment variables with validation
export function getApiKey(res) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    res.status(500).json({ 
      error: 'API key not configured',
      message: 'The Google Maps API key is not set in the environment variables.'
    });
    return null;
  }
  
  return apiKey;
}

// Standard error response handler
export function handleError(res, error, customMessage = null) {
  console.error('API error:', error);
  res.status(500).json({ 
    error: 'Server error', 
    message: customMessage || error.message || 'An unexpected error occurred'
  });
}
