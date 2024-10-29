/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "*",
        protocol: "https",
      },
    ],
    unoptimized: true,
    domains: ["web.cricap.com"],
  },
};

export default nextConfig;
