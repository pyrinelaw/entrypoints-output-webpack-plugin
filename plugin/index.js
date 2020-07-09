'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const writeJson = require('write-json');

const getTargetFile = (files = [], suffix = '.js') => {
    let file = undefined;

    for (let i = 0; i < files.length; i++) {
        const temp = files[i];
        if (temp.endsWith(suffix)) {
            if (!file) {
                file = temp;
            } else {
                // 构建过程中，会存在其他插件生成额外的 js 文件，影响输出
                // 例如 热更新中的 hot-update：app.171443217f5176a47fb9.hot-update.js
                temp.length < file.length ? temp : file;
            }
        }
    }

    return file;
}

/**
 * 初始转换 entry 入口
 */
const initConvertEntry = function() {
    console.warn(this.entry);
    console.warn('into initConvertEntry ===<');
    if ((typeof this.entry == 'string') || (this.entry instanceof Array)) {
        console.warn('entry need convert');
        this.entry = {
            main: this.entry,
        }
    }
}

class EntrypointsOutputWebpackPlugin {
    constructor(options = {}) {
        this.options = options;
    }

    apply(compiler) {
        const options = this.options || {};
        compiler.hooks.emit.tapAsync(
            'entrypoints-output-webpack-plugin',
            (compilation, callback) => {
                const entrypoints = compilation.entrypoints || new Map();
                const entrypointsKeys = entrypoints.keys();
                const entrypointsIterator = entrypoints.entries();
                const showFullPath = options.showFullPath || false;
                const initOutput = options.initOutput || {};
                const outputData = Object.assign({}, initOutput);
                const publicPath = compiler.options.output.publicPath;
                const output = options.output || compiler.options.output.path;
                const filename = options.filename || '.entrypoints.json';
                const filepath = path.resolve(output, filename);
    
                if (/\.+\.json$/.test(filename)) {
                    assert(null, 'options.filename Must be json file, for example： ".entrypoints.json"');
                }
        
                for (let [key, value] of entrypointsIterator) {
                    // rendered 表示已经构建执行完毕？
                    // 是否需要判断 rendered ？
                    // value.chunks[0].rendered
        
                    const files = _.get(value, 'chunks[0].files', []);
                    const js = getTargetFile(files, '.js');
                    const css = getTargetFile(files, '.css');
                    outputData[key] = {};
        
                    if (js) {
                        outputData[key].js = showFullPath ? `${publicPath}${js}` : js;
                    }
                    if (css) {
                        outputData[key].css = showFullPath ? `${publicPath}${css}` : css;
                    }
                };
        
                writeJson(filepath, outputData);
    
                callback();
            }
        );
        
        // Compile 开始进入编译环境，开始编译
        // Compilation 即将产生第一个版本
        // make任务开始
        // optimize作为Compilation的回调方法，优化编译，在Compilation回调函数中可以为每一个新的编译绑定回调。
        // after-compile编译完成
        // emit准备生成文件，开始释放生成的资源，最后一次添加资源到资源集合的机会
        // after-emit文件生成之后，编译器释放资源
    }

}

module.exports = EntrypointsOutputWebpackPlugin;