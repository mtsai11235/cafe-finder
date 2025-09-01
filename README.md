# Cafe Finder

A web application that helps users find cafes near their location or a specified address using Google Maps API.

## Features

- Display a map centered on the user's location or a searched location
- Search for cafes near a specific location
- View cafe details including name, address, rating, and opening hours
- Responsive design that works on both desktop and mobile devices

## Deployment

This application is designed to be deployed to Vercel with secure API key handling.

### Prerequisites

1. A [Vercel](https://vercel.com) account
2. A Google Maps API key with the following APIs enabled:
   - Maps JavaScript API
   - Places API
   - Geocoding API

### Deployment Steps

1. Fork or clone this repository to your GitHub account
2. Connect your repository to Vercel
3. Add your Google Maps API key as an environment variable:
   - Name: `GOOGLE_MAPS_API_KEY`
   - Value: Your Google Maps API key
4. Deploy the application

### API Key Security

This application uses serverless functions to keep your Google Maps API key secure:

- The API key is stored as an environment variable on Vercel
- API requests are proxied through serverless functions
- The key is never exposed in client-side code

## Project Structure

```
/
├── lib/                # Shared utilities
│   └── api-utils.js    # API utilities for serverless functions
├── pages/              # Next.js pages
│   ├── api/            # API routes (serverless functions)
│   │   ├── get-maps-url.js  # Secure Maps API URL generator
│   │   ├── health.js        # Health check endpoint
│   │   └── proxy.js         # API proxy for Google Maps
│   ├── _app.js         # Next.js app component
│   ├── _document.js    # Next.js document component
│   └── index.js        # Main page (redirects to static HTML)
├── public/             # Static files
│   ├── index.html      # Main HTML file
│   ├── script.js       # Main application logic
│   ├── secure-api.js   # Secure API client
│   └── styles.css      # Application styles
├── next.config.js      # Next.js configuration
├── package.json        # Project dependencies
└── vercel.json         # Vercel configuration
```

## Technologies Used

- JavaScript (ES6+)
- Next.js (for API routes)
- Google Maps JavaScript API
- Google Places API
- Vercel Serverless Functions

## License

This project is licensed under the MIT License.
