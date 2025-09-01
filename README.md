# Cafe Finder

A simple web application that helps users find cafes near their location or a specified address using Google Maps API.

## Features

- Display a map centered on the user's location or a searched location
- Search for cafes near a specific location
- View cafe details including name, address, rating, and opening hours
- Responsive design that works on both desktop and mobile devices

## Setup Instructions

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/cafe-finder.git
   cd cafe-finder
   ```

2. Get a Google Maps API key:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the following APIs (all are required for the app to work properly):
     - Maps JavaScript API
     - Places API
     - Geocoding API
   - Create an API key from the Credentials page
   - Restrict the API key to your domain for security
   - **Important**: Make sure billing is enabled for your Google Cloud project, as the Places API and Geocoding API require billing to be set up (even if you're within the free tier limits)

3. Add your API key:
   - For local development:
     - Copy `config.template.js` to `config.js`
     - Open `config.js` and add your Google Maps API key:
       ```javascript
       const CONFIG = {
           GOOGLE_MAPS_API_KEY: "YOUR_API_KEY_HERE",
       };
       ```
     - Note: `config.js` is in `.gitignore` to prevent your API key from being committed to the repository
   
   - For website deployment (see "Deployment" section below for more details):
     - The application supports multiple ways to provide the API key when deployed

4. Open the application:
   - You can use a local server to run the application, for example:
     - With Python: `python -m http.server` (then visit http://localhost:8000)
     - With Node.js: Install `http-server` via npm and run it
   - Alternatively, you can simply open the `index.html` file in your browser

## Usage

1. When the app loads, it will show a map centered on a default location
2. Click "Use My Location" to center the map on your current location and find nearby cafes
3. Or enter a location in the search box and click "Search" to find cafes in that area
4. Cafe results will appear as markers on the map and in the list on the right
5. Click on a marker or list item to see more details about that cafe

## Troubleshooting

### Ad Blockers
- If you see a warning about an ad blocker, some features of the app may not work correctly
- The error `ERR_BLOCKED_BY_CLIENT` in the console is typically caused by ad blockers
- To fix this, either disable your ad blocker or add the site to your allowlist

### API Key Issues
- If you see authentication errors, make sure your API key is correct and has the necessary APIs enabled
- The Google Maps API requires billing to be set up in your Google Cloud Console (even for free tier usage)
- Ensure all three required APIs are enabled: Maps JavaScript API, Places API, and Geocoding API

## Deployment

The application is designed to be deployed to various hosting platforms while keeping your API key secure. Here are several deployment options:

### Option 1: Static Site Hosting with Runtime Configuration

For platforms like GitHub Pages, Netlify, or Vercel:

1. Create a `config.js` file for each environment (development, staging, production)
2. During deployment, copy the appropriate config file to the build directory
3. You can automate this with deployment scripts or CI/CD pipelines

### Option 2: Environment Variables with Build Process

For platforms that support environment variables during build:

1. Set up your API key as an environment variable in your hosting platform
   - Netlify: Add in Site settings > Build & deploy > Environment
   - Vercel: Add in Project settings > Environment Variables
   - GitHub Pages with Actions: Add as a repository secret

2. The `deploy-config.js` file will automatically use the environment variable if available

### Option 3: Server-Side API Key Injection

For more secure deployments with a backend:

1. Create a simple backend API endpoint that serves the API key
2. Modify the frontend to fetch the key from your backend
3. Store the actual API key only on the server

See `deployment-options.md` for more detailed instructions on each approach.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Google Maps JavaScript API
- Google Places API

## License

This project is licensed under the MIT License - see the LICENSE file for details.
