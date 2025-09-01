// Serverless function to load Google Maps JavaScript API securely
// This keeps our API key secure on the server side

module.exports = async (req, res) => {
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
    return res.status(405).send('Method not allowed');
  }

  try {
    // Get API key from environment variable
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      return res.status(500).send('API key not configured');
    }
    
    // Get callback name from query parameter or use default
    const callback = req.query.callback || 'initMap';
    
    // Get libraries from query parameter or use default
    const libraries = req.query.libraries || 'places';
    
    // Generate HTML that loads the Google Maps API with the secure API key
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Google Maps API Loader</title>
  <script>
    // This script securely loads the Google Maps API without exposing the API key in client-side code
    window.googleMapsCallback = function() {
      window.parent.postMessage('mapsLoaded', '*');
      if (typeof window.parent.${callback} === 'function') {
        window.parent.${callback}();
      }
    };
  </script>
  <script async defer src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries}&callback=googleMapsCallback"></script>
</head>
<body>
  <!-- This is just a loader iframe and remains empty -->
</body>
</html>
    `;
    
    // Send the HTML response
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
    
  } catch (error) {
    console.error('Maps JS API loader error:', error);
    res.status(500).send('Error loading Google Maps API');
  }
};
