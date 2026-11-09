import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The AI chatbot reads src/content/about-me.md at runtime. This tells Next.js to
  // ship that folder with the API routes when deployed (e.g. on Vercel).
  outputFileTracingIncludes: {
    "/api/**": ["./src/content/**"],
  },
};

export default nextConfig;
