/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname, // ensures the root is THIS project folder
  },
};

module.exports = nextConfig;
