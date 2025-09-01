/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Serve static files from the public directory
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/index.html',
      },
    ];
  },
  
  // Configure the output for Vercel deployment
  output: 'standalone',
};

module.exports = nextConfig;
