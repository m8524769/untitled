'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

module.exports = {
  entry: {
    app: ['./src/index.tsx']
  },
  output: {
    filename: '[name].[hash:8].js',
    chunkFilename: '[name].[hash:8].chunk.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx'],
    // symlinks: false,
    plugins: [
      new TsConfigPathsPlugin({
        configFilePath: '/tsconfig.json',
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: ['eslint-loader'],
      },
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            use: ['url-loader']
          },
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: ['babel-loader',
              {
                loader: 'awesome-typescript-loader',
                options: {
                  silent: process.argv.includes("--json")  // 否则会把日志输出到 stats.json
                }
              }
            ]
          },
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: ['babel-loader']
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader']
          },
          {
            test: /\.less$/,
            use: [
              'style-loader',
              'css-loader',
              'postcss-loader',
              {
                loader: 'less-loader',
                options: {
                  javascriptEnabled: true
                }
              },
            ]
          },
          { // Fallback
            exclude: [/\.(ts|js)x?$/, /\.html$/, /\.json$/],
            use: ['file-loader']
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      meta: {
        viewport: 'width=device-width, initial-scale=1',
      },
      title: 'AppHub',
      favicon: path.join(__dirname, '../src/assets', 'favicon.ico'),
    }),
    // ...(fs.existsSync('vendor')
    //   ? fs.readdirSync('vendor')
    //     .filter(filename => filename.endsWith('.manifest.json'))
    //     .map(manifest =>
    //       new webpack.DllReferencePlugin({
    //         manifest: path.join(__dirname, '../vendor', manifest),
    //       })
    //     )
    //   : []
    // ),
    // new AddAssetHtmlPlugin({
    //   filepath: path.resolve(__dirname, '../vendor/*.dll.js'),
    //   publicPath: '/vendor',
    //   outputPath: 'vendor',
    // }),
    new webpack.ContextReplacementPlugin(
      /moment[/\\]locale$/, /zh-cn/
    ),
  ]
}
