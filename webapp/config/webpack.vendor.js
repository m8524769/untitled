'use strict';

const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {  // <=4
    react: ['react', 'react-dom', 'react-router-dom'],
    mobx: ['mobx'],
    // lodash: ['lodash'],  // Unused
    antd: ['antd'],  // Remove it in production mode
  },
  output: {
    filename: '[name].[hash].dll.js',
    path: path.resolve(__dirname, '../vendor'),
    library: '_dll_[name]',
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        path.join(process.cwd(), 'vendor/**/*'),
      ],
    }),
    new webpack.DllPlugin({
      name: '_dll_[name]',
      path: path.join(__dirname, '../vendor', '[name].manifest.json'),
    }),
  ],
};
