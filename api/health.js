// Simple health check endpoint to verify serverless functions are working
module.exports = async (req, res) => {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    // Get API key status (without revealing the key)
    const apiKeyStatus = process.env.GOOGLE_MAPS_API_KEY ? 'configured' : 'missing';
    
    // Return basic health information
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL_ENV || 'development',
      apiKeyStatus: apiKeyStatus,
      node: process.version
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error',
      message: error.message
    });
  }
};
