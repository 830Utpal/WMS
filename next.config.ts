/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
      DATABASE_URL:process.env.NEXT_PUBLIC_DATABASE_URL,
      NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID:process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID,
      NEXT_PUBLIC_GEMINI_API_KEY:process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  },
};

export default nextConfig;