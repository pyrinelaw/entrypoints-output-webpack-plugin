// webpack v4
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const EntrypointsOutputWebpackPlugin = require('../../plugin/index.js');
const MultipleJsEntryPlugin = require('multiple-js-entry-plugin');

const env = process.env.NODE_ENV;

module.exports = {
    mode: 'development',
    
    entry: path.join(__dirname, '../src/app.js'),
    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name]-[hash].js',
        // filename: '[name].js',
        chunkFilename: '[name]-[chunkhash]x.js',
        publicPath: 'http://localhost:1093/',
    },
    resolve: {
        extensions: ['.js', '.vue'],
    },
    stats: {
        // 'errors-only'
        // 移除样式文件引入顺序不一致告警
        warningsFilter: warning => /Conflicting order between/gm.test(warning),
    },
    devServer: {
        open: false,
        hot: true,
        contentBase: path.join(__dirname, '..', 'dist'),
        compress: true,
        watchContentBase: false,
        port: 1093,
        // allowedHosts: ['.youzan.com', '0.0.0.0', '*'],
        disableHostCheck: true, // 禁止检测 host 域名
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        watchOptions: {
            aggregateTimeout: 500,
            ignore: /node_modules/,
        },
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015', 'stage-0'], // <--- here
                    },
                },
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader, // 将css提取为单独的文件
                    },
                    // 将 vue 文件中的样式文件插入到 html 中
                    // 使用了 MiniCssExtractPlugin 进行分离，所以不需要再使用 vue-style-loader
                    // 否则会报错，style-loader 也是同理
                    // 'vue-style-loader',
                    // 'style-loader',
                    'css-loader', // 将 CSS 转化成 js 模块
                    'postcss-loader',
                    'sass-loader', // 将 Sass/Scss 编译成 CSS
                ],
            },
            {
                test: /\.(jpg|png|gif|bmp|jpeg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8192, // 小于 1 KB 图片使用 base64
                    },
                },
            }, // 处理 图片路径的 loader
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]-[hash].css',
            chunkFilename: '[id]-[hash].css',
            ignoreOrder: true,
        }),
        new MultipleJsEntryPlugin({
            src: path.join(__dirname, '../src'),
            split: '-',
            level: 0,
        }),
        // 默认值
        new EntrypointsOutputWebpackPlugin(),
        // // 参数测试
        // new EntrypointsOutputWebpackPlugin({
        //     // 是否展示全部路径，设置为 ture 时会加上 webpack 配置中的 output.publicPath 
        //     showFullPath: true,    
        //     // 输出目录，必须写绝对路径，不传入时，默认使用 webpack 配置中的 output.path
        //     output: path.join(__dirname, '../a/b/c'),
        //     // json 文件名，默认为 “.entrypoints.json”
        //     filename: 'a.json',
        //     // filename: '.entrypoints.json',
        //     // 初始输出，输出的文件夹中除了默认的 entrypoints ,还会包含 initOutput 中的值
        //     initOutput: {
        //         init: {
        //             js: 'https://www.google.com/xxx.js',
        //             css: 'https://a.b.com/x/y/z.css',
        //         },
        //     },
        // }),
    ],
};
