// Secure API client for Google Maps services
// This file handles API requests without exposing the API key

// Namespace for our secure API client
const SecureAPI = {
  // Base URL for our API proxy
  baseUrl: '/api/proxy',
  
  // Function to make a secure request to Google Maps API via our proxy
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
      const response = await fetch(`${this.baseUrl}?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Secure API request error:', error);
      throw error;
    }
  },
  
  // Places API - Nearby Search
  async nearbySearch(params) {
    return this.request('maps/api/place/nearbysearch/json', params);
  },
  
  // Places API - Text Search
  async textSearch(params) {
    return this.request('maps/api/place/textsearch/json', params);
  },
  
  // Places API - Place Details
  async getPlaceDetails(params) {
    return this.request('maps/api/place/details/json', params);
  },
  
  // Geocoding API
  async geocode(params) {
    return this.request('maps/api/geocode/json', params);
  },
  
  // Load Google Maps JavaScript API securely
  loadMapsApi(callback = 'initMap', libraries = 'places') {
    return new Promise((resolve, reject) => {
      try {
        // Create a hidden iframe to load the Maps API
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = `/api/maps-js?callback=${encodeURIComponent(callback)}&libraries=${encodeURIComponent(libraries)}`;
        
        // Listen for the 'mapsLoaded' message from the iframe
        window.addEventListener('message', function onMessage(event) {
          if (event.data === 'mapsLoaded') {
            // Remove the event listener and iframe once loaded
            window.removeEventListener('message', onMessage);
            document.body.removeChild(iframe);
            resolve();
          }
        });
        
        // Handle iframe load errors
        iframe.onerror = function() {
          document.body.removeChild(iframe);
          reject(new Error('Failed to load Google Maps API'));
        };
        
        // Add the iframe to the document
        document.body.appendChild(iframe);
        
      } catch (error) {
        console.error('Error loading Maps API:', error);
        reject(error);
      }
    });
  }
};

// Export the SecureAPI object
window.SecureAPI = SecureAPI;
