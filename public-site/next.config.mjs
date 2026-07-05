/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  allowedDevOrigins: ['127.0.0.1:3000', 'localhost:3000', '127.0.0.1'],
  turbopack: {
    root: process.cwd()
  }
};

export default nextConfig;
