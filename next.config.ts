import type { NextConfig } from 'next';
const config: NextConfig = {
  output: 'export',
  poweredByHeader: false,
  images: {
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    deviceSizes: [640,960,1440,1920],
    imageSizes: [96,160,320],
  },
};
export default config;
