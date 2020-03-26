# 如何使用 rollup 构建 js？

## 创建 package.json 文件

```js
npm init
```

## 安装 rollup

```bish
yarn add rollup -D
```

## Babel

### 许多开发人员在他们的项目中使用[Babel](https://babeljs.io/)，以便他们可以使用未被浏览器和 Node.js 支持的将来版本的 JavaScript 特性。

```bish
yarn add @babel/core @babel/preset-env babel-preset-es2015-rollup -D
```

```bish
yarn add rollup-plugin-babel -D
```

### 添加到 Rollup 配置文件 rollup.config.js:

```js
// rollup.config.js
import babel from "rollup-plugin-babel";

export default {
  input: "src/main.js",
  output: {
    file: "dist/index.js",
    format: "cjs",
    name: "evenbus",
    minify: true
  },
  plugins: [
    babel({
      exclude: "node_modules/**"
    })
  ]
};
```

### 现在，在我们运行 rollup 之前，我们需要安装 external-helpers 插件

```bish
yarn add babel-plugin-external-helpers -D
```

### 若使用 class 需要安装 plugin-proposal-class-properties 插件

```bish
yarn add @babel/plugin-proposal-class-properties -D
```

### 添加到 Babel 配置文件 babel.config.js:

```js
// babel.config.js
module.exports = {
  presets: ["@babel/preset-env"],
  plugins: ["@babel/plugin-proposal-class-properties"]
};
```

### 使用 rollup-plugin-uglify 插件进行代码压缩

```bish
yarn add rollup-plugin-uglify -D
```

### 添加到 Rollup 配置文件 rollup.config.js:

```js
// rollup.config.js
import { uglify } from "rollup-plugin-uglify";

export default {
  input: "src/main.js",
  output: {
    file: "dist/index.js",
    format: "cjs",
    name: "evenbus",
    minify: true
  },
  plugins: [
    ...,
    uglify()
  ]
};
```

### 将 package.json `main`指向打包后的 js：`dist/index.js`

---
