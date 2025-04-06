/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  
  // Allow all standard page extensions
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  
  // Moved from experimental to top level
  skipTrailingSlashRedirect: true,

  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
