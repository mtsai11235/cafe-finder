/**
 * Health check endpoint to verify serverless functions are working
 */
import { setCorsHeaders, handleOptions, validateMethod, handleError } from '../../lib/api-utils';

export default async function handler(req, res) {
  try {
    // Set CORS headers
    setCorsHeaders(res);
    
    // Handle OPTIONS request (preflight)
    if (handleOptions(req, res)) return;
    
    // Validate request method
    if (!validateMethod(req, res, ['GET'])) return;
    
    // Get API key status (without revealing the key)
    const apiKeyStatus = process.env.GOOGLE_MAPS_API_KEY ? 'configured' : 'missing';
    
    // Return basic health information
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL_ENV || 'production',
      apiKeyStatus: apiKeyStatus,
      version: '1.0.0'
    });
  } catch (error) {
    handleError(res, error, 'Health check failed');
  }
}
