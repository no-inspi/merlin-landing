import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  webpack: (config) => {
    config.externals = [
      ...(config.externals || []),
      { "framer-motion": "framer-motion" },
    ];
    return config;
  },
};

export default nextConfig;
