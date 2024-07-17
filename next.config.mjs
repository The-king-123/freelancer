/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "freelancer.mg",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
