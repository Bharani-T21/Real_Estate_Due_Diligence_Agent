/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // /api and /auth are proxied at request time by src/proxy.js using BACKEND_URL.
  // Do not bake rewrites here: Docker `next build` would lock in localhost:8080.
};

export default nextConfig;
