var path = require('path');

module.exports = {
  entry: {
    // 'main': './src/index.js',
    'login': './src/login.js',
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
          'css-loader',
          "sass-loader"
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env'], // Use @babel/preset-env for modern JavaScript features
          },
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
