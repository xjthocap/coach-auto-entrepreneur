import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 an
  },
  compress: true,
  poweredByHeader: false, // sécurité + best practices
};

export default nextConfig;
