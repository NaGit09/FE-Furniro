import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
      ],
  },
};

export default nextConfig;
