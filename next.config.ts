import type { NextConfig } from "next";

const nextConfig: NextConfig = {
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
    {
      protocol: 'https',
      hostname: 'lh3.googleusercontent.com',
    },
    {
      protocol: 'https',
      hostname: '**',
    },
    {
      protocol: 'https',
      hostname: 'maps.googleapis.com',
    },
    {
      protocol: 'https',
      hostname: 'maps.gstatic.com',
    }
  ],
},
};

export default nextConfig;
