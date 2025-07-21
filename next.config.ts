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
    remotePatterns: [ new URL("https://avatars.githubusercontent.com/**"), 
                      new URL('https://lh3.googleusercontent.com/**'), 
                      new URL('https://res.cloudinary.com/**')],
  },
};

export default nextConfig;
