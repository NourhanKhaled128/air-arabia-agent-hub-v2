import type { NextConfig } from "next";

// Server Actions reject any request whose Origin header isn't in this list —
// production and Vercel preview domains must be included or every mutation
// (form submit, quiz answer, admin publish/create, etc.) 403s at runtime even
// though the build itself succeeds. VERCEL_URL is set automatically by Vercel
// and differs per preview deployment, so it's included dynamically.
const allowedOrigins = [
  "localhost:3000",
  "*.app.github.dev",
  "air-arabia-agent-hub-v2.vercel.app",
  ...(process.env.VERCEL_URL ? [process.env.VERCEL_URL] : []),
];

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins,
    },
  },
};

export default nextConfig;
