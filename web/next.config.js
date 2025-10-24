//@ts-check

const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
  // Produce a minimal standalone server output for Docker runtime
  output: 'standalone',
  async rewrites() {
    // Proxy web requests made to /api/* to the Express API.
    // In containers, we want to hit the 'api' service; locally, default to localhost.
    const target = process.env.API_INTERNAL_ORIGIN || 'http://localhost:3001';
    return [
      {
        source: '/api/:path*',
        destination: `${target}/api/:path*`,
      },
    ];
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
