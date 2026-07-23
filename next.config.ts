import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d1kgd37c1b2jmu.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

