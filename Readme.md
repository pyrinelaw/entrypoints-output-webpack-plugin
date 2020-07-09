## entrypoints-output-webpack-plugin

webpack 插件，构建输出 output 文件配置，包含 js 与 css 输出资源，webpack >= 4.0.0

### 使用示例

```javascript
const EntrypointsOutputWebpackPlugin = require('entrypoints-output-webpack-plugin');

new EntrypointsOutputWebpackPlugin({
//     // 是否展示全部路径，设置为 ture 时会加上 webpack 配置中的 output.publicPath 
//     showFullPath: true,    
//     // 输出目录，必须写绝对路径，不传入时，默认使用 webpack 配置中的 output.path
//     output: path.join(__dirname, '../a/b/c'),
//     // 输出 json 文件名，默认为 “.entrypoints.json”
//     filename: 'a.json',
//     // filename: '.entrypoints.json',
//     // 初始输出，输出的文件夹中除了默认的 entrypoints ,还会包含 initOutput 中的值
//     initOutput: {
//         init: {
//             js: 'https://www.google.com/xxx.js',
//             css: 'https://a.b.com/x/y/z.css',
//         },
//     },
}),
```

### option 参数说明

参数     | 类型 | 是否必传 | 默认值 | 说明
-------- | --- | --- | --- | ---
showFullPath | Boolean | 否 | false | 是否展示全部路径，设置为 ture 时会加上 webpack 配置中的 output.publicPath
output | String | 否 | 默认使用 webpack 配置中的 output.path | 输出目录，必须写绝对路径，不传入时，默认使用 webpack 配置中的 output.path
filename | String | 否 | .entrypoints.json | 输出 json 文件名，默认为 “.entrypoints.json”
initOutput | Object | 否 | null | 初始输出，输出的文件夹中除了默认的 entrypoints ,还会包含 initOutput 中的值