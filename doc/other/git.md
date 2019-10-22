# 规范git提交利器指南 😆

## 推荐使用git-cz（可选：cz-conventional-changelog ｜ cz-emoji配置方法同下）



### 一、全局安装

```bish
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
git-cz
```

### 二、通过`commitizen`本地安装

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
