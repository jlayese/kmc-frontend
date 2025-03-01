import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["hnmprofile.s3.eu-central-1.amazonaws.com"], // Allow external images from S3
  },
};

export default nextConfig;
