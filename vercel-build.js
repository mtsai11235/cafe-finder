// This script runs during Vercel build to create a config.js with environment variables
const fs = require('fs');

// Get API key from environment variable
const apiKey = process.env.GOOGLE_MAPS_API_KEY || '';

if (!apiKey) {
  console.warn('WARNING: No Google Maps API key found in environment variables!');
}

// Create config.js file with the API key
const configContent = `// This file is auto-generated during build - do not edit manually
const CONFIG = {
  GOOGLE_MAPS_API_KEY: "${apiKey}",
};
`;

// Write the file
fs.writeFileSync('./config.js', configContent);
console.log('Generated config.js with environment variables');
