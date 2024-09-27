/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "*",
                protocol: "https"
            }
        ],
        domains: ["web.cricap.com"]
    },

};

export default nextConfig;
