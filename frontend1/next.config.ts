import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,

    qualities: [75],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
