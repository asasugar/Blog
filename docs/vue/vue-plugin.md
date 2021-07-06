# 如何编写 Vue 插件？

## 展示主要代码，详细可点击 👉[vue-plugin](https://github.com/asasugar/vue-plugin)

### 主要目录结构

```js
// 原理就是编写vue插件，使用webpack打包
├─example
│  └─src
│      └─assets
├─src
│    └─index.js
│    └─vue-plugin.vue // 跟平时编写vue组件一样
│
├─.babelrc
│
├─package.json
│
├─webpack.config.js

```

### index.js

```js
import VuePluginComponent from "./vue-plugin.vue";

const VuePlugin = {
  install(Vue, options) {
    Vue.component(VuePluginComponent.name, VuePluginComponent);
  }
};
if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(VuePlugin);
}
export default VuePlugin;
```

### webpack.config.js 配置

```js
const path = require("path");
const webpack = require("webpack");
module.exports = {
  entry: "./src/index.js", // 打包插件时打包目录
  output: {
    path: path.resolve(__dirname, "./dist"),
    publicPath: "/dist/",
    filename: "vue-plugin.js", // 打包的插件名
    library: "VuePlugin", // require引入时的模块名
    libraryTarget: "umd", //libraryTarget会生成不同umd的代码,可以只是commonjs标准的，也可以是指amd标准的，也可以只是通过script标签引入的。
    umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define。
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"]
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {}
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: [
          path.resolve("src"),
          path.resolve("test"),
          path.resolve("node_modules/pinyin/lib")
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]?[hash]"
        }
      }
    ]
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.common.js"
    },
    extensions: ["*", ".js", ".vue", ".json"]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: "#eval-source-map"
};

if (process.env.NODE_ENV === "production") {
  module.exports.devtool = "#source-map";
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
}
```

### package.json

```json
{
  "name": "vue-plugin",
  "description": "A componets of vue for xxx",
  "version": "1.0.0",
  "author": "xuexiongjie <xxj95719@gmail.com>",
  "license": "MIT",
  "private": false,
  "main": "dist/vue-plugin.js",
  "repository": {
    "type": "git",
    "url": "https://github.com/asasugar/vue-initial-list"
  },
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack-dev-server --open --hot",
    "build": "cross-env NODE_ENV=production webpack --progress --hide-modules",
    "republish": "npm run build"
  },
  "dependencies": {
    "vue": "^2.5.11"
  },
  "browserslist": ["> 1%", "last 2 versions", "not ie <= 8"],
  "devDependencies": {
    "babel-core": "^6.26.0",
    "babel-loader": "^7.1.2",
    "babel-preset-env": "^1.6.0",
    "babel-preset-stage-3": "^6.24.1",
    "cross-env": "^5.0.5",
    "css-loader": "^0.28.7",
    "file-loader": "^1.1.4",
    "node-sass": "^4.9.0",
    "sass-loader": "^7.0.1",
    "uglify-js": "git://github.com/mishoo/UglifyJS2#harmony-v2.8.22",
    "vue-loader": "^13.0.5",
    "vue-template-compiler": "^2.4.4",
    "webpack": "^3.6.0",
    "webpack-dev-server": "^2.9.1"
  }
}
```

### 发布 npm

```js
npm login
// 输入npm账号，密码

npm publish
// 发布插件前会执行`republish`命令，完成打包压缩
```
