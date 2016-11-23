var webpack = require('webpack')

var config = module.exports = {
  devtool: 'source-map',

  entry: {
    'example': './lib/example.js'
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

if (process.env.NODE_ENV === 'production') {
  config.externals = {
    'react': 'react'
  }
}
