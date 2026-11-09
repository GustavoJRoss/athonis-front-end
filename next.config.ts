import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gera .next/standalone (server.js + dependências mínimas) para a imagem Docker.
  output: "standalone",
};

export default nextConfig;
