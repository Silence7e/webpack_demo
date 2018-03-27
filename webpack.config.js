const webpack = require('webpack');
const PurifyWebpack = require('purifycss-webpack');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineChunkPlugin = require('html-webpack-inline-chunk-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer');
const eslintFirendlyFormatter = require('eslint-friendly-formatter');

const path = require('path');
const glob = require('glob-all');

const extractLess = new ExtractTextWebpackPlugin({ filename: 'css/[name]-bundle-[hash:5].css' });

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'js/[name].bundle.[hash].js',
  },
  // externals: {   jquery: 'jQuery', },
  devServer: {
    port: 9001,
    overlay: true,
    //  inline: false,
    proxy: {
      '/': {
        target: 'https://www.lvjinsuo.com',
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
          '^/investments': '/api/investments/platform',
        },
        headers: {
          Cookie: '',
        },
      },
    },
    historyApiFallback: {
      rewrites: [
        {
          from: '^([a-zA-Z0-9]+)/?([a-zA-Z0-9]+)/a',
          // to:'pages/a.html'
          to: context => `/${context.match[1] + context.match[2]}.html`,
        },
      ],
    },
    hot: true,
    hotOnly: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,

        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  'env', {
                    targets: {
                      browsers: ['last 2 versions', 'safari >= 7'],
                    },
                  },
                ],
              ],
              // plugins: ['lodash'],
            },
          }, {
            loader: 'eslint-loader',
            options: {
              fomatter: eslintFirendlyFormatter,
            },
          },
        ],
      }, {
        test: /\.less$/,
        use: extractLess.extract({
          fallback: [
            {
              loader: 'style-loader',
              options: {
                singleton: true,
              },
            },
          ],
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                // modules: true, minimize: true, sourceMap: true,
              },
            }, {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [
                  // require('postcss-sprites')({   spritePath:'dist/assets/imgs/sprites' }),
                  autoprefixer(),
                  // require('postcss-cssnext')()
                ],
              },
            }, {
              loader: 'less-loader',
            },
          ],
        }),
      }, {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name][hash:5].min.[ext]',
              limit: 500,
              // publicPath:'',
              outputPath: 'assets/imgs/',
              // useRelativePath: true,
            },
          }, {
            loader: 'img-loader',
            options: {
              pngquant: {
                quality: 80,
              },
            },
          },
          // {   loader:'file-loader',   options:{     useRelativePath: true,   } }
        ],
      }, {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              publicPath: '',
              outputPath: 'dist/',
              attrs: ['img:src', 'img:data-src'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    extractLess,
    new PurifyWebpack({
      paths: glob.sync([
        path.join(__dirname, './*.html'),
        './src/*.js',
      ]),
    }),
    new webpack
      .optimize
      .CommonsChunkPlugin({ name: 'manifest' }),
    new HtmlInlineChunkPlugin({ inlineChunks: ['manifest'] }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      minify: {
        collapseWhitespace: true,
      },
    }),
    new webpack
      .optimize
      .UglifyJsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.ProvidePlugin({ $: 'jquery' }),
    new CleanWebpackPlugin(['dist']),
  ],
};
