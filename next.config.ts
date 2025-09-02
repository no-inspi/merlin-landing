import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: "loose",
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), "motion"];
    return config;
  },
};

export default nextConfig;
