/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@better-auth/kysely-adapter"],
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      { protocol: "http",
        hostname: "**",

      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port:"",
        pathname:"/**"
      },
    ],
  },
};

export default nextConfig;
