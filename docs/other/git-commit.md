# 规范git提交利器指南

## 推荐使用git-cz（可选：cz-conventional-changelog ｜ cz-emoji配置方法同下）

这种提交格式不香吗？ 😍

![20191022165222.png](https://i.loli.net/2019/10/22/OHbd5vM1uQz69A4.png)

### 一、全局安装

```bish
npm install -g commitizen
npm install -g git-cz
```

package.json:

```json
{
  "config": {
    "commitizen": {
      "path": "git-cz"
    }
  },
}
```
run

```bish
git cz / git-cz
```

### 二、本地安装

```bish
npm install -g commitizen
yarn add git-cz -D
```
package.json:

```json
{
  "config": {
    "commitizen": {
      "path": "./node_modules/git-cz"
    }
  },
}
```

run

```bish
git cz
```
