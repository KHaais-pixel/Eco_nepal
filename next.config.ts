import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Admin image uploads are capped at 8 MB (src/lib/cms/uploads.ts);
      // allow that plus multipart overhead. The default is 1 MB. This stays
      // under the proxy's 10 MB body buffer, so no proxy change is needed.
      bodySizeLimit: "9mb",
    },
  },
};

export default nextConfig;
