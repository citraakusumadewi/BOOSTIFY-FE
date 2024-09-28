/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  images: {
    domains: ['ik.imagekit.io'], // Add your external image domain here
  },
};

module.exports = nextConfig;