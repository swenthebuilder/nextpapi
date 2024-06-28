/** @type {import('next').NextConfig} */
const nextConfig = {

    webpack: (config, { isServer }) => {
        if (!isServer) {
          config.module.rules.push({
            test: /\.worker\.(js|ts)$/,
            loader: 'worker-loader',
            options: {
              filename: 'static/[hash].worker.js',
              publicPath: '/_next/',
            },
          });
        }
        
        config.output.globalObject = "(typeof self !== 'undefined' ? self : this)";
        
        return config;
      },
};

export default nextConfig;
