import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "1mb" },
  },
  serverExternalPackages: ["@huggingface/transformers", "onnxruntime-node"],
};

export default config;
