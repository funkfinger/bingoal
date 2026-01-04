/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // Empty turbopack config to silence migration warning
  turbopack: {},
};

export default nextConfig;
