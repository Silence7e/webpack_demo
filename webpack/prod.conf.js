
const webpack = require('webpack');
const PurifyWebpack = require('purifycss-webpack');
const HtmlInlineChunkPlugin = require('html-webpack-inline-chunk-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const path = require('path');
const glob = require('glob-all');

module.exports = {
  plugins: [
    new PurifyWebpack({
      paths: glob.sync([
        path.join(__dirname, './*.html'),
        './src/*.js',
      ]),
    }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'manifest' }),
    new HtmlInlineChunkPlugin({ inlineChunks: ['manifest'] }),
    new webpack.optimize.UglifyJsPlugin(),
    new CleanWebpackPlugin(['dist']),
  ],
};
