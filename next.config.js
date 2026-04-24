/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/curious-site',
  assetPrefix: '/curious-site',
};

module.exports = nextConfig;
