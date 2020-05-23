'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpackCommonConfig = require('./webpack.common');

module.exports = merge(webpackCommonConfig, {
  mode: 'production',
  output: {
    filename: '[name].[hash:8].js',
    chunkFilename: '[name].[hash:8].chunk.js',
    publicPath: './'
  },
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
        parallel: true,
        cache: true,
      }),
      new OptimizeCSSAssetsPlugin(),
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    // Todo
    // new WorkboxPlugin.InjectManifest({}),
  ]
});
