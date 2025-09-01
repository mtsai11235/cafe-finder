/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Configure the output for Vercel deployment
  output: 'standalone',
  
  // Disable automatic static optimization for the index page
  // This ensures Next.js properly renders our page
  experimental: {
    // This allows us to use fs module in getStaticProps
    serverComponentsExternalPackages: ['fs']
  }
};

module.exports = nextConfig;
