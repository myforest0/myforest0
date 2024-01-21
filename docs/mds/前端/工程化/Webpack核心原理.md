---
title: Webpack核心原理
urlname: pa2vzf
date: '2021-06-27 11:49:50'
updated: '2024-01-21 12:22:12'
description: 对于Webpack来说，它本质上就是一个模块打包器，正是由于有了Loader和Plugin，才让Webpack有了其他各种各样的功能。Webpack打包后的文件创建项目mkdir demo && cd demo npm init -y安装依赖yarn add webpack webpack-c...
---
对于`Webpack`来说，它本质上就是一个模块打包器，正是由于有了`Loader`和`Plugin`，才让`Webpack`有了其他各种各样的功能。

## Webpack打包后的文件
### 创建项目
```javascript
mkdir demo && cd demo
npm init -y
```
### 安装依赖
```javascript
yarn add webpack webpack-cli html-webpack-plugin -D
```
### 配置webpack.config.js
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
    mode: 'development',
    // devtool: 'none', // webpack5中不用配置
    entry: './src/index.js',
    output: {
        filename: 'built.js',
        path: path.resolve('dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
}
```
### 运行打包
```javascript
yarn webpack
```
`Webpack4`打包结果：<br />在`Webpack4`中，`Webpack`打包后的文件只是一个`IIFE`，这个函数的参数是一个“模块定义”的对象。键名是当前被加载文件的文件路径和文件名拼接而来的，键值是一个函数(和`NodeJS`中的模块加载有些类似)，这个函数会在将来的某个时机被调用，同时会接收到一定的参数，利用这些参数就可以实现模块的加载操作。
```javascript
(function(modules) {
	// ...
})
({
  "./src/index.js": function (module, exports, __webpack_require__) {
    eval(
      "const test = __webpack_require__(/*! ./test */ \"./src/test.js\")\nconsole.log('hello wlord!')\nconsole.log(test)\n\nmodule.exports = 'Index Export'\n\n//# sourceURL=webpack:///./src/index.js?"
    );
  },

  "./src/test.js": function (module, exports) {
    eval(
      "console.log(11111)\n\n\nmodule.exports = 'Test Exports'\n\n//# sourceURL=webpack:///./src/test.js?"
    );
  },
})
```
`Webpack5`打包结果：<br />而在`Webpack5`中，模块定义对象被放到函数内部了，函数参数是空的，代码相比`Webpack4`更少。
```javascript
(() => {
  // webpackBootstrap
  var __webpack_modules__ = {
    "./src/index.js": (
      module,
      __unused_webpack_exports,
      __webpack_require__
    ) => {
      eval(
        "const test = __webpack_require__(/*! ./test */ \"./src/test.js\")\nconsole.log('hello wlord!')\nconsole.log(test)\n\nmodule.exports = 'Index Export'\n\n//# sourceURL=webpack://01/./src/index.js?"
      );
    },
    "./src/test.js": (module) => {
      eval(
        "console.log(11111)\n\n\nmodule.exports = 'Test Exports'\n\n//# sourceURL=webpack://01/./src/test.js?"
      );
    },
  };
  // The module cache
  var __webpack_module_cache__ = {};

  // The require function
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    // Create a new module (and put it into the cache)
    var module = (__webpack_module_cache__[moduleId] = {
      // no module.id needed
      // no module.loaded needed
      exports: {},
    });

    // Execute the module function
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

    // Return the exports of the module
    return module.exports;
  }

  // startup
  // Load entry module and return exports
  // This entry module is referenced by other modules so it can't be inlined
  var __webpack_exports__ = __webpack_require__("./src/index.js");
})();
```
我们可以看到打包后是一个`IIFE`(自执行函数)，而这是为了产生一个闭包。
## 单文件打包执行流程解析
![](/images/ca0e9e761723c3d9cc26013e3d3785c1.jpeg)

## Webpack打包主流程分析
编写调试代码，新建`debug.js`：
```javascript
const webpack = require("webpack");
const options = require("./webpack.config.js");

const compiler = webpack(options);

compiler.run((err, stats) => {
  console.log(err);
  console.log(
    stats.toJson({
      entries: true,
      chunks: false,
      modules: false,
      assets: false,
    })
  );
});
```
打开`VS Code`调试模式，将断点定到第四行，接下来就开始分析它的主要流程：<br />![](/images/12d5889ffe2aad3ce7e98ed6eae7d1fd.jpeg)




