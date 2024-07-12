# 除了PR以外，如何优雅地解决npm依赖 bug

试想这样一种场景：当我们遇到 npm 依赖的bug，并且在本地 node_modules 中进行修复了，然后一个依赖更新（npm i 或者 yarn等等）就把 node_modules 里面的更改覆盖了。同时，因为修改是本地的，我们没有办法很便捷地在团队中进行共享（通常是每个人都在本地进行修改...）

本文介绍的 `patch-package` 这个开源项目就是解决上面的问题，它有以下的特点：

- 持久化更改到本地
- 通过执行简单的命令就能同步更改，给你的依赖打上一个补丁

## 一、安装依赖与添加脚本命令

### 1. 首先安装依赖

```bash
yarn add patch-package postinstall-postinstall
```

### 2. 安装依赖后，在 package.json 文件中添加一个脚本命令

```json
{
    "scripts": {
       "postinstall": "patch-package"
    }
}
```

`postinstall` 钩子会在 yarn、yarn install 或者 yarn add 命令之后触发，目的是在依赖更新后将补丁打进依赖。而依赖更新还有另外一个操作：`yarn remove`，`postinstall-postinstall` 这个包就是保证执行 `yarn remove` 后也能触发 `postinstall` 的执行。

### 3. 修改依赖

这里以修改 `node_modules/react/index.js` 这个依赖文件为例，在里面添加一条 `console.log` 语句：

```js
'use strict';

console.log('patch-package')

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react.production.min.js');
} else {
  module.exports = require('./cjs/react.development.js');
}
```

### 4. 生成补丁

生成补丁的命令是：

```bash
yarn patch-package package-name
```

上面的 `package-name` 就是我们修改的依赖包名，在这个例子中为 `react`。执行 `yarn patch-package react` 后可以看到根目录新增了一个 `patches` 目录。

`patches` 目录下的文件就是记录 `node_modules` 中的变更操作，因此我们可以将补丁文件上传到 `git` 仓库，团队其他开发者拉取代码后，只需要执行 `patch-package` 命令就能同步给 `node_modules` 打上补丁。
