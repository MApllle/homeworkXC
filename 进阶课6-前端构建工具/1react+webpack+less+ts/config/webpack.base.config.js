
module.exports = {
    resolve: {
      // 定义 import 引用时可省略的文件后缀名
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    module: {
      rules: [
        {
          test: /(\.js(x?))$/,
          use: [
            {
              loader: "babel-loader",
            },
          ],
          exclude: /node_modules/, 
        },
        {
          test: /(\.ts(x?))$/,
          use: [
            {
              loader: "ts-loader",
            },
            {
              loader: "./mypluginandloader/myloader.js",
            }
          ],
          exclude: /node_modules/, 
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          use: [
            {
              loader: "url-loader",
              options: {
                  name: 'images/[name].[ext]',
                  esModule: false,
              },
            },
          ],
        },
      ],
    },
  };
  
  