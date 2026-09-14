/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    let backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
    // Render's fromService gives a bare service slug or hostname
    if (backendUrl && !backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
      if (!backendUrl.includes('.')) {
        backendUrl = `https://${backendUrl}.onrender.com`;
      } else {
        backendUrl = `https://${backendUrl}`;
      }
    }
    return [
      {
        source: '/auth/:path*',
        destination: `${backendUrl}/auth/:path*`
      },
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`
      },
    ];
  },
};

export default nextConfig;
