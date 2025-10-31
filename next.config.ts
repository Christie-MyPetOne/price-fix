import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        // ✅ Este é o domínio que você precisa para o JSON de produtos pet
        hostname: "picsum.photos",
        port: "",
        pathname: "/**", // Autoriza todas as imagens
      },
      // (Você pode remover os outros domínios se não for mais usá-los)
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        port: "",
        pathname: "/product-images/**",
      },
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
        port: "",
        pathname: "/img/**",
      },
    ],
  },
};

export default nextConfig;
