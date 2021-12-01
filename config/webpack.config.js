'use strict';

var path = require('path');
var webpack = require('webpack');

// must match config.webpack.dev_server.port
var devServerPort = 3808;

// set NODE_ENV=production on the environment to add asset fingerprints
var production = process.env.NODE_ENV === 'production';
var local = process.env.NODE_ENV === 'local';
var development = process.env.NODE_ENV === 'development';

var config = {
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
