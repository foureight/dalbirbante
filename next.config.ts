import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow local preview via 127.0.0.1 (not just localhost) so client
  // hydration / HMR work in Cloud Agent and browser previews.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
