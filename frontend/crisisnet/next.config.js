/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    let backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8080";
    if (!/^https?:\/\//.test(backendUrl)) backendUrl = `https://${backendUrl}`;
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
