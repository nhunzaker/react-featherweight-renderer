var webpack = require('webpack')

var config = module.exports = {
  devtool: 'source-map',

  entry: {
    'example': './example/example.js'
  },

  output: {
    path: __dirname + "/dist",
    filename: "[name].js",
  },

  module: {
    rules: [{
      test: /\.js$/,
      use: ['babel']
    }]
  }
}
