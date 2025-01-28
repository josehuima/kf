import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jqidnghoneocwhtcpbjn.supabase.co',
        pathname: '**',
      },
      ], // Adicione o domínio do Supabase aqui
  },
};

export default nextConfig;
