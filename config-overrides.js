const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const tailwindcss = require('tailwindcss');
const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = function override(config, env) {
    config.plugins = config.plugins.map((plugin) => {
        if (plugin.constructor.name === 'GenerateSW') {
            return new WorkboxWebpackPlugin.InjectManifest({
                swSrc: './src/sw.js',
                swDest: 'service-worker.js',
            });
        }
        return plugin;
    });
    require('react-app-rewire-postcss')(config, {
        plugins: [
            tailwindcss('./tailwind.config.js'),
            require('autoprefixer'),
            process.env.NODE_ENV === 'production' &&
                purgecss({
                    content: ['./public/index.html', './src/**/*.js'],
                    defaultExtractor: (content) =>
                        content.match(/[\w-/:]+(?<!:)/g) || [],
                }),
        ],
    });
    return config;
};
