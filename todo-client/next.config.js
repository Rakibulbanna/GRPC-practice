/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve Node.js modules on the client to prevent these errors
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        path: false,
        os: false,
        crypto: false,
        http2: false,
        stream: false,
        zlib: false,
        util: false,
        buffer: false,
        events: false,
        assert: false,
        constants: false,
        process: false,
        url: false,
        http: false,
        https: false,
        querystring: false,
        string_decoder: false,
        timers: false,
        punycode: false,
        module: false,
        vm: false,
        domain: false,
        console: false,
        cluster: false,
        dgram: false,
        readline: false,
        repl: false,
        tty: false,
        v8: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
