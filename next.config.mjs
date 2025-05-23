/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  // Configuración para Next.js 15.3.2
  experimental: {
    serverComponentsExternalPackages: ['mongodb'],
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
