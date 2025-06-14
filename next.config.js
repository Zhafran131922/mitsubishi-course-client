// next.config.js

const nextConfig = {
  output: "export", // ⬅️ Build statis

  images: {
    unoptimized: true, // ⬅️ WAJIB untuk static export
    domains: ["localhost", "duanol.mitsubishi-training.my.id"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "duanol.mitsubishi-training.my.id",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
