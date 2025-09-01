import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Note: Body size limits are handled at the deployment level (Vercel: 4.5MB)
  // and in our API routes with proper validation
};

export default nextConfig;
