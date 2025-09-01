/**
 * Secure API client for Google Maps services
 * This file handles API requests without exposing the API key
 */

/**
 * Maps API Client - Handles secure communication with Google Maps API
 */
class MapsApiClient {
  constructor() {
    this.proxyUrl = '/api/proxy';
    this.mapsUrlEndpoint = '/api/get-maps-url';
  }

  /**
   * Make a secure request to Google Maps API via our proxy
   * @param {string} endpoint - The Google Maps API endpoint
   * @param {object} params - The parameters to send
   * @returns {Promise<object>} - The API response
   */
  async request(endpoint, params) {
    try {
      // Add the endpoint to the parameters
      const queryParams = {
        endpoint,
        ...params
      };
      
      // Build the query string
      const queryString = Object.keys(queryParams)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        .join('&');
      
      // Make the request to our proxy
      const response = await fetch(`${this.proxyUrl}?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Secure API request error:', error);
      throw error;
    }
  }

  /**
   * Places API - Nearby Search
   * @param {object} params - Search parameters
   */
  async nearbySearch(params) {
    return this.request('maps/api/place/nearbysearch/json', params);
  }
  
  /**
   * Places API - Text Search
   * @param {object} params - Search parameters
   */
  async textSearch(params) {
    return this.request('maps/api/place/textsearch/json', params);
  }
  
  /**
   * Places API - Place Details
   * @param {object} params - Place details parameters
   */
  async getPlaceDetails(params) {
    return this.request('maps/api/place/details/json', params);
  }
  
  /**
   * Geocoding API
   * @param {object} params - Geocoding parameters
   */
  async geocode(params) {
    return this.request('maps/api/geocode/json', params);
  }
  
  /**
   * Load Google Maps JavaScript API securely
   * @param {string} callback - Callback function name
   * @param {string} libraries - Comma-separated list of libraries to load
   * @returns {Promise<void>} - Resolves when API is loaded
   */
  async loadMapsApi(callback = 'initMap', libraries = 'places') {
    try {
      // Get the Maps API URL from our secure endpoint
      const response = await fetch(`${this.mapsUrlEndpoint}?callback=${encodeURIComponent(callback)}&libraries=${encodeURIComponent(libraries)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get Maps API URL: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.url) {
        throw new Error('Invalid response from server');
      }
      
      // Create and load the script
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = data.url;
        script.async = true;
        script.defer = true;
        
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Maps API script'));
        
        document.head.appendChild(script);
      });
    } catch (error) {
      console.error('Error loading Maps API:', error);
      throw error;
    }
  }
}

// Create and export the API client
window.SecureAPI = new MapsApiClient();
