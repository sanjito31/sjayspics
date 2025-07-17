import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb', // Increase from default 1MB
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['avatars.githubusercontent.com', 
                'lh3.googleusercontent.com',
                  'res.cloudinary.com'],
  },

};

export default nextConfig;
