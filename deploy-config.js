// This file handles API key configuration for both development and production
(function() {
  // Function to get API key from various sources
  function getApiKey() {
    // Priority 1: Check for runtime config from server-side injection
    if (window.RUNTIME_CONFIG && window.RUNTIME_CONFIG.GOOGLE_MAPS_API_KEY) {
      console.log("Using runtime injected API key");
      return window.RUNTIME_CONFIG.GOOGLE_MAPS_API_KEY;
    }
    
    // Priority 2: Check for config.js (local development)
    if (typeof CONFIG !== 'undefined' && CONFIG.GOOGLE_MAPS_API_KEY) {
      console.log("Using config.js API key");
      return CONFIG.GOOGLE_MAPS_API_KEY;
    }
    
    // Priority 3: Check for environment variable (build-time injection)
    if (typeof process !== 'undefined' && process.env && process.env.GOOGLE_MAPS_API_KEY) {
      console.log("Using build-time environment variable");
      return process.env.GOOGLE_MAPS_API_KEY;
    }
    
    // Priority 4: Check URL parameters (for demo/testing only - not secure)
    const urlParams = new URLSearchParams(window.location.search);
    const urlKey = urlParams.get('api_key');
    if (urlKey) {
      console.log("Using URL parameter API key (not secure for production)");
      return urlKey;
    }
    
    // No API key found
    console.error("No Google Maps API key found. Please configure an API key.");
    return null;
  }
  
  // Create global API configuration
  window.API_CONFIG = {
    getGoogleMapsApiKey: getApiKey,
    
    // Function to load Google Maps with the appropriate key
    loadGoogleMapsScript: function(callback) {
      const apiKey = this.getGoogleMapsApiKey();
      
      if (!apiKey) {
        const mapDiv = document.getElementById('map');
        if (mapDiv) {
          mapDiv.innerHTML = '<div style="text-align:center;padding:20px;"><h3>API Key Missing</h3>' +
            '<p>Please configure your Google Maps API key. See README.md for instructions.</p></div>';
        }
        return;
      }
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      // Add error handling
      script.onerror = function() {
        console.error('Failed to load Google Maps API script');
        const mapDiv = document.getElementById('map');
        if (mapDiv) {
          mapDiv.innerHTML = '<div style="text-align:center;padding:20px;"><h3>Error loading Google Maps</h3>' +
            '<p>Please check your internet connection and make sure your API key is valid.</p></div>';
        }
      };
      
      document.head.appendChild(script);
    }
  };
})();
