
const webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-surce-map',
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
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
};
