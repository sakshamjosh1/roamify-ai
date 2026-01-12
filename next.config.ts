import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "places.googleapis.com",
      "images.unsplash.com",
      "plus.unsplash.com",
    ],
  },
};

export default nextConfig;
