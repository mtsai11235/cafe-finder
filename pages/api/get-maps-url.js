// Serverless function to generate a Google Maps API URL with the secure API key
export default async function handler(req, res) {
  try {
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

    // Get API key from environment variable
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API key not configured',
        message: 'The Google Maps API key is not set in the environment variables.'
      });
    }
    
    // Get callback and libraries from query parameters or use defaults
    const callback = req.query.callback || 'initMap';
    const libraries = req.query.libraries || 'places';
    
    // Generate the Google Maps API URL with the API key
    const mapsUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries}&callback=${callback}`;
    
    // Return the URL in the response
    res.status(200).json({ url: mapsUrl });
    
  } catch (error) {
    console.error('Error generating Maps URL:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: 'An error occurred while generating the Maps URL.' 
    });
  }
}
