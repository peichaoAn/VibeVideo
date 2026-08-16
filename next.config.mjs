/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  // Static export is only needed for `next build` (Electron / static hosting).
  // In dev mode we disable it so `next dev` gives us full HMR (hot reload),
  // otherwise every code change requires a manual restart.
  output: isDev ? undefined : "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Disable the dev-mode static route indicator toast (bottom-right corner).
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
};

export default nextConfig;
