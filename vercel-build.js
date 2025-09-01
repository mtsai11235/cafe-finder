// This script runs during Vercel build to create a config.js with environment variables
const fs = require('fs');

// Get API key from environment variable
const apiKey = process.env.GOOGLE_MAPS_API_KEY || '';

if (!apiKey) {
  console.warn('WARNING: No Google Maps API key found in environment variables!');
  console.warn('Make sure to set GOOGLE_MAPS_API_KEY in your Vercel project settings.');
  // Don't fail the build, but make it clear there's an issue
}

// Create config.js file with the API key
const configContent = `// This file is auto-generated during build - do not edit manually
window.RUNTIME_CONFIG = {
  GOOGLE_MAPS_API_KEY: "${apiKey}",
};

// For compatibility with existing code
const CONFIG = window.RUNTIME_CONFIG;

// Log the API key status (but not the actual key) for debugging
console.log("API Key status: " + (window.RUNTIME_CONFIG.GOOGLE_MAPS_API_KEY ? "Loaded from environment" : "Missing"));
`;

// Write the file
fs.writeFileSync('./config.js', configContent);
console.log('Generated config.js with environment variables');

// Also create a verification file to help debug
const verificationContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Environment Variable Verification</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .success { color: green; }
    .error { color: red; }
    code { background: #f4f4f4; padding: 2px 5px; }
  </style>
</head>
<body>
  <h1>Environment Variable Verification</h1>
  <script src="config.js"></script>
  <script>
    document.write('<div id="api-key-status"></div>');
    
    window.addEventListener('load', function() {
      const statusDiv = document.getElementById('api-key-status');
      
      if (window.RUNTIME_CONFIG && window.RUNTIME_CONFIG.GOOGLE_MAPS_API_KEY) {
        const keyPreview = window.RUNTIME_CONFIG.GOOGLE_MAPS_API_KEY.substring(0, 5) + '...' + 
                          window.RUNTIME_CONFIG.GOOGLE_MAPS_API_KEY.substring(window.RUNTIME_CONFIG.GOOGLE_MAPS_API_KEY.length - 5);
        
        statusDiv.innerHTML = '<h2 class="success">✅ API Key Found!</h2>' +
                             '<p>API Key preview: ' + keyPreview + '</p>' +
                             '<p>Your environment variables are working correctly.</p>' +
                             '<p><a href="index.html">Go to the Cafe Finder app</a></p>';
      } else {
        statusDiv.innerHTML = '<h2 class="error">❌ API Key Missing!</h2>' +
                             '<p>The Google Maps API key was not found in your environment variables.</p>' +
                             '<p>Please make sure you have set the <code>GOOGLE_MAPS_API_KEY</code> environment variable in your Vercel project settings.</p>' +
                             '<ol>' +
                             '<li>Go to your Vercel project dashboard</li>' +
                             '<li>Navigate to Settings > Environment Variables</li>' +
                             '<li>Add <code>GOOGLE_MAPS_API_KEY</code> with your Google Maps API key value</li>' +
                             '<li>Redeploy your project</li>' +
                             '</ol>';
      }
    });
  </script>
</body>
</html>
`;

fs.writeFileSync('./verify-env.html', verificationContent);
console.log('Generated verification page for environment variables');
