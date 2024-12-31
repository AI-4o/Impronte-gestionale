/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.iwsafari.com',
        port: '',
        pathname: '/sites/default/files/**',
      },
    ],
  },
};

export default nextConfig;
