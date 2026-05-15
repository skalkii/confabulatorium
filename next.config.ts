import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "1mb" },
  },
  serverExternalPackages: ["@huggingface/transformers", "onnxruntime-node"],
  /**
   * Exclude onnxruntime-node's GPU/TensorRT provider binaries from the
   * serverless function bundle. They are huge (~350MB combined) and we
   * have no GPU on Vercel anyway — only the CPU library is needed.
   * Paired with ONNXRUNTIME_NODE_INSTALL_CUDA=skip in vercel.json which
   * prevents the postinstall from downloading them in the first place.
   */
  outputFileTracingExcludes: {
    "*": [
      "**/onnxruntime-node/bin/**/*_providers_cuda*",
      "**/onnxruntime-node/bin/**/*_providers_tensorrt*",
      "**/onnxruntime-node/bin/**/*.dll",
      "**/onnxruntime-node/bin/**/win32/**",
      "**/onnxruntime-node/bin/**/darwin/**",
    ],
  },
};

export default config;
