/** @type {import('next').NextConfig} */
const nextConfig = {

     
    webpack: (config, { isServer, webpack }) => {

        if (!isServer) {
            config.optimization.minimize = true; // Ensure minification is still enabled
        }

        config.resolve = {
            ...config.resolve,
            fallback: {
                fs: false,
                net: false,
                tls: false,
            },

        };
        return config;
    },

};

export default nextConfig;





