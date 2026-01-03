/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  // Exclude Astro source directory from Next.js
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  webpack: (config, { isServer }) => {
    // Ignore Astro files
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/src/**", "**/.astro/**", "**/dist/**"],
    };
    return config;
  },
};

export default nextConfig;
