const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js'); 

const devConfig = {
    mode: 'development', // 开发模式
    entry: path.join(__dirname, "../src/index.tsx"), // 入口，处理资源文件的依赖关系
    output: {
        path: path.join(__dirname, "../src/"),
        filename: "index.js",
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /.less$/,
                exclude: /.min.css$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: "global"
                            }
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        'postcss-preset-env',
                                        {
                                            // 其他选项
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                    { loader: 'less-loader' }
                ]
            },
            {
                test: /.min.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                ]
            },
        ]
    },
    devServer: {
        static: path.join(__dirname, '../src/'),
        compress: true,
        host: '127.0.0.1',
        port: 8899, // 启动端口
        open: true, // 打开浏览器
        historyApiFallback: true,
    },
};
module.exports = merge(devConfig, baseConfig); // 合并配置
