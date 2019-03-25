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
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /react/,
          chunks: "initial",
          name: "vendor",
          enforce: true
        }
      }
    }
  },
  resolve: {
    modules: ['node_modules']
  }
};
