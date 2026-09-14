/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    let backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
    // Render's fromService gives a bare hostname — add https:// if no protocol present
    if (backendUrl && !backendUrl.startsWith('http')) {
      backendUrl = 'https://' + backendUrl;
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
