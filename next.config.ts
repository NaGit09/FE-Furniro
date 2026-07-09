import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "zsofa.vn",
        },
        {
          protocol: "https",
          hostname: "zsofa.vn",
        },
        {
          protocol: "https",
          hostname: "images.furniro.com",
        },
        {
          protocol: "https",
          hostname: "res.cloudinary.com",
        },
        {
          protocol: "https",
          hostname: "images.unsplash.com",
        },
        {
          protocol: "https",
          hostname: "placehold.co",
        },
      ],
  },
};

export default nextConfig;
