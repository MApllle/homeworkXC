const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.config.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 用于将组件的css打包成单独的文件输出到`lib`目录中
const MyPlugin = require("../mypluginandloader/myplugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const prodConfig = {
  mode: "production", // 生产模式
  entry: {
    index: path.join(__dirname, "../src/index.tsx"),
  },
  output: {
    publicPath: "./",
    path: path.join(__dirname, "../dist/"),
    filename: "index.js",
  },
  module: {
    rules: [
      {
        test: /.less$/,
        exclude: /.min.css$/,
        use: [
          { loader: "style-loader" },
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: "css-loader",
            options: {
              modules: {
                mode: "global",
              },
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["postcss-preset-env"]],
              },
            },
          },
          {
            loader: "less-loader",
          },
        ],
      },
      {
        test: /.min.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "index.min.css", // 提取后的css的文件名
    }),
    new MyPlugin({ filename: "filename.md" }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "../src/index.html"),
    }),
  ],
};
module.exports = merge(prodConfig, baseConfig); // 合并配置
