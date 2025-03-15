import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env:{
    DATABASE_URL:process.env.DATABASE_URL,
    WEB3_AUTH_CLIENT_ID:process.env.WEB3_AUTH_CLIENT_ID
  }
};

export default nextConfig;
