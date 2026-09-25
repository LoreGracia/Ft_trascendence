import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  typescript: {ignoreBuildErrors: true},
  allowedDevOrigins: ['dice.eina.cc', '*.dice.eina.cc'],
};

export default nextConfig;
