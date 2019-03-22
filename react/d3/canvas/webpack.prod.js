import webpack from 'webpack';
const path = require('path');

module.exports = {
  entry: './src/SimpleChart.jsx',
  output: {
    path: path.resolve('build'),
    filename: 'charts.js'
  },
  module: {
    rules: [
      {
        test: /[\.js|\.jsx]$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['list', 'react'],
      minChunks: 2,
    })
  ],
  resolve: {
    modules: ['node_modules']
  }
};
