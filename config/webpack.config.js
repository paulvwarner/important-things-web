'use strict';

let path = require('path');

// set NODE_ENV=production on the environment to add asset fingerprints
let production = process.env.NODE_ENV === 'production';
let local = process.env.NODE_ENV === 'local';
let development = process.env.NODE_ENV === 'development';

let config = {
    entry: {
        application: './app/javascript/application.js'
    },

    output: {
        // Build assets directly in to public/webpack/, let webpack know
        // that all webpacked assets start with webpack/

        // must match config.webpack.output_dir
        path: path.join(__dirname, '..', 'public', 'webpack'),
        publicPath: '/webpack/',

        filename: production ? '[name]-[chunkhash].js' : '[name].js'
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
};

if (local || development) {
    config.mode = 'development';
    config.optimization = {
        minimize: false
    };
} else {
    config.mode = 'production';
    config.optimization = {
        minimize: true
    };
}

module.exports = config;
