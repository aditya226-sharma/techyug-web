/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['127.0.0.1:3000', 'localhost:3000', '127.0.0.1'],
  experimental: {
    turbopack: {
      root: './'
    }
  }
};

export default nextConfig;
