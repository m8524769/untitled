'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackCommonConfig = require('./webpack.common');

module.exports = merge(webpackCommonConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    hot: true,
    historyApiFallback: true,
    disableHostCheck: true,
    host: process.env.HOST || '0.0.0.0',
    port: parseInt(process.env.PORT, 10) || 4200,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ]
});
