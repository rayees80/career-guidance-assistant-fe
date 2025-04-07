/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.squ.edu.om",
      },
    ],
  },
};

export default nextConfig;