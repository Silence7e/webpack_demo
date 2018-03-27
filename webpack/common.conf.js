const productionConfig = require('./prod.conf');
const developmentConfig = require('./dev.conf');

const merge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// const autoprefixer = require('autoprefixer');
const postcssCssnext = require('postcss-cssnext');
const postcssSprites = require('postcss-sprites');
const eslintFirendlyFormatter = require('eslint-friendly-formatter');

const path = require('path');


const generateConfig = (env) => {
  const extractLess = new ExtractTextWebpackPlugin({ filename: 'css/[name]-bundle-[hash:5].css' });

  const scriptLoader = ['babel-loader']
    .concat(env === 'production'
      ? []
      : [{
        loader: 'eslint-loader',
        options: {
          exclude: [/node_modules/],
          fomatter: eslintFirendlyFormatter,
        },
      }]);

  const cssLoader = [
    {
      loader: 'css-loader',
      options: {
        importLoaders: 2,
        sourceMap: env === 'development',
        // modules: true, minimize: true,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        sourceMap: env === 'development',
        plugins: [
          // autoprefixer(),
          postcssCssnext(),
        ].concat(env === 'production'
          ? [postcssSprites({ spritePath: 'dist/assets/imgs/sprites' })]
          : []),
      },
    },
    {
      loader: 'less-loader',
    },
  ];

  const styleloader = env === 'production'
    ? extractLess.extract({
      fallback: 'style-loader',
      use: cssLoader,
    })
    : ['style-loader'].concat(cssLoader);

  const fileLoader = env === 'development' ? [{
    loader: 'file-loader',
    options: {
      name: '[name]-[hash:5].[ext]',
      outputPath: 'assets/imgs',
    },
  }] : [{
    loader: 'url-loader',
    options: {
      name: '[name][hash:5].min.[ext]',
      limit: 500,
      // publicPath:'',
      outputPath: 'assets/imgs/',
      // useRelativePath: true,
    },
  }];

  return {
    entry: {
      app: './src/app.js',
    },
    output: {
      path: path.resolve(__dirname, '../dist'),
      publicPath: '/',
      filename: 'js/[name].bundle.[hash].js',
    },
    resolve: {
      alias: {
        jquery$: path.resolve(__dirname, '../src/libs/jquery.min.js'),
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [path.resolve(__dirname, '../src')],
          exclude: [path.resolve(__dirname, '../src/libs')],
          use: scriptLoader,
        }, {
          test: /\.less$/,
          use: styleloader,
        }, {
          test: /\.(png|jpg|jpeg|gif)$/,
          use: fileLoader.concat(env === 'production'
            ? [{
              loader: 'img-loader',
              options: {
                pngquant: {
                  quality: 80,
                },
              },
            }]
            : []),
        },
        {
          test: /\.(eot|woff2?|ttf|svg)/,
          use: fileLoader,
        },
        {
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
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './index.html',
        minify: {
          collapseWhitespace: true,
        },
      }),
      new webpack.ProvidePlugin({ $: 'jquery' }),
    ],
  };
};


module.exports = (env) => {
  const config = env === 'production' ? productionConfig : developmentConfig;
  return merge(generateConfig(env), config);
};
