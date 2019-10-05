const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: "./src/test.tsx", // 本地测试
  // entry: "./src/index.tsx", // 打包
  output: {
    filename: "react-cascader-transfer.js",
    path: path.resolve(__dirname),
    libraryTarget: 'umd',
  },
  // Enable sourcemaps for debugging webpack's output.
  // devtool: "source-map",
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      { 
        test: /\.(js|jsx|tsx)?$/, 
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html')
    })
  ],
  // externals: { // 打包到生产并发布到npm上需要开启，因为用到了react hooks，不然会因为有两个react副本而导致hooks报错
  //   react: {
  //     root: 'React',
  //     commonjs2: 'react',
  //     commonjs: 'react',
  //     amd: 'react'
  //   },
  //   'react-dom': {
  //     root: 'ReactDOM',
  //     commonjs2: 'react-dom',
  //     commonjs: 'react-dom',
  //     amd: 'react-dom'
  //   }
  // },
};