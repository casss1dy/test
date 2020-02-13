const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  mode: 'development',
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.html$/,
        use:  [
          {
            loader: 'html-loader',
            options: { minimize: false },
          }
        ]
      },
      // {
      //   test: /\.css$/,
      //   use: [MiniCssExtractPlugin.loader, 'css-loader'],
      // },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/'
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'img'
            }},
        ]
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: require.resolve('style-loader')
          },
          {
            loader: require.resolve('css-loader'),
            options: {
              sourceMap: true // it's a Boolean variable
            }
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              plugins: [
                autoprefixer(),
                cssnano()
              ]
            }
          },
          {
            loader: require.resolve('resolve-url-loader'),
          },
          {
            loader: require.resolve('sass-loader'),
            options: {
              sourceMap: true
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './index.html',
      filename: './index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    // liveReload: false
  }
};
