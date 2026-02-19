import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  sw: "sw.js",
  // fallbacks: {
  //   document: "/offline",
  // },
});

const nextConfig: NextConfig = {
  // Konfigurasi Next.js yang sudah ada
  reactStrictMode: true,
};

export default withPWA(nextConfig);