import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://www.gstatic.com/**')],
  },
  /* other config options here */
};

export default nextConfig;
