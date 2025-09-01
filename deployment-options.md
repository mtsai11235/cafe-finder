# Deployment Options for Cafe Finder

When deploying your Cafe Finder app to a website, you have several options for handling the API key securely:

## Option 1: Environment Variables with Build Process

If you're using a build process (like webpack, Parcel, or Create React App):

1. Create a `.env` file (add to .gitignore):
   ```
   GOOGLE_MAPS_API_KEY=your_actual_api_key
   ```

2. Use a build tool to inject the environment variable:
   ```javascript
   // With webpack and dotenv plugin
   const apiKey = process.env.GOOGLE_MAPS_API_KEY;
   ```

3. For deployment platforms like Netlify, Vercel, or GitHub Pages:
   - Set the environment variable in your deployment platform's settings
   - The build process will inject the correct API key during deployment

## Option 2: Server-Side API Key Management

For better security, use a server to protect your API key:

1. Create a simple backend (Node.js, Python, etc.) that serves as a proxy:
   ```javascript
   // Example with Express.js
   app.get('/api/maps-key', (req, res) => {
     res.json({ key: process.env.GOOGLE_MAPS_API_KEY });
   });
   ```

2. Update your frontend to fetch the key:
   ```javascript
   async function loadGoogleMapsScript() {
     const response = await fetch('/api/maps-key');
     const data = await response.json();
     const apiKey = data.key;
     
     const script = document.createElement('script');
     script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
     // ...rest of your code
   }
   ```

3. This approach keeps your API key off the client entirely

## Option 3: Restricted API Key

If you must include the API key in your frontend code:

1. Create a highly restricted API key in Google Cloud Console:
   - Restrict by HTTP referrer to only allow your specific domain
   - Restrict by IP address if your users come from known IPs
   - Enable only the specific APIs you need

2. Set up usage quotas and alerts to monitor for abuse

3. Include the restricted key directly in your deployed code

## Option 4: Runtime Configuration

For static hosting without a build process:

1. Create a `config.js` file that's loaded at runtime but excluded from your repository:
   ```javascript
   const CONFIG = {
     GOOGLE_MAPS_API_KEY: "your_actual_api_key"
   };
   ```

2. For each deployment environment, manually create this file with the appropriate key

3. Add a script to your deployment process that generates this file with the correct key

## Recommended Approach

For most deployments, Option 1 (environment variables with build process) provides the best balance of security and convenience. If you need enhanced security, Option 2 (server-side proxy) is recommended.
