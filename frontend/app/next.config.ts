import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.1.226:8000/:path*',
      },
    ]
  },
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/leaderboard',
        permanent: true,
      }
    ]
  }
};

export default nextConfig;
