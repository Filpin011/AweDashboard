import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://www.gstatic.com/**'),
      new URL('https://www.google.com/**'),
      new URL('https://t3.gstatic.com/**'),
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
