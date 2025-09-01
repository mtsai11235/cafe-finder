// This script runs during Vercel build to create a config.js with environment variables
const fs = require('fs');
const path = require('path');

console.log('Starting Vercel build process...');

// Create dist directory if it doesn't exist
const distDir = './dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
  console.log('Created dist directory');
}

// Get API key from environment variable
const apiKey = process.env.GOOGLE_MAPS_API_KEY || '';

if (!apiKey) {
  console.warn('WARNING: No Google Maps API key found in environment variables!');
  console.warn('Make sure to set GOOGLE_MAPS_API_KEY in your Vercel project settings.');
  // Don't fail the build, but make it clear there's an issue
}

// Create a placeholder config file (API key is now handled by serverless functions)
const configContent = `// This file is auto-generated during build - do not edit manually
// The actual API key is now handled securely by serverless functions
window.RUNTIME_CONFIG = {
  API_VERSION: "2.0",
  USES_SERVERLESS: true,
  BUILD_TIME: "${new Date().toISOString()}"
};

// For compatibility with existing code
const CONFIG = window.RUNTIME_CONFIG;

console.log("Using secure serverless API key handling");
`;

// Write the file to dist directory
fs.writeFileSync(path.join(distDir, 'config.js'), configContent);
console.log('Generated config.js with environment variables');

// Create a verification file to help debug
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

fs.writeFileSync(path.join(distDir, 'verify-env.html'), verificationContent);
console.log('Generated verification page for environment variables');

// Copy all necessary files to dist directory
const filesToCopy = [
  'index.html',
  'script.js',
  'styles.css',
  'secure-api.js',
  'README.md',
  'vercel-deployment.md',
  'debug.html'
];

filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(distDir, file));
    console.log(`Copied ${file} to dist directory`);
  } else {
    console.warn(`Warning: File ${file} not found, skipping`);
  }
});

console.log('Build completed successfully!');
