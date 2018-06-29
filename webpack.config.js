const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const nested = require('postcss-nested')
module.exports = {
    entry: {
        "index": "./example/basic.tsx"
    },
    output: {
        "path": path.join(__dirname, "dist"),
        "filename": "[name].bundle.js",
    },
    module: {
        rules: [
            { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/},
            {
                "include": [
                    path.join(__dirname, 'example')
                ],
                test: /\.pcss$/,
                use: [
                    { loader: 'style-loader'},
                    { loader: 'css-loader', options: { importLoaders: 1 , sourceMap: false, url: false} },
                    { loader: "postcss-loader", options:{
                        ident: 'postcss',
                        plugins: [autoprefixer, cssnano, nested]
                    }}
                ]
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },

    plugins: [
        new HTMLWebpackPlugin({
            title:'react daum map',
            filename: 'index.html',
            template: 'example/basic.html'
        }), //index.html 파일 생성
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000
    },
    stats: {
        children: false,
        modules: false,
    }
};