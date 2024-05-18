var path = require('path');

module.exports = {
  entry: {
    'main': './src/index.js'
  },
  devtool: 'source-map',
  mode: 'development',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public/dist/')
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(ttf|png|jpeg)$/,
        exclude: /node_modules/,
        use: {
          loader: 'url-loader',
        },
      },
    ]
  }
}
