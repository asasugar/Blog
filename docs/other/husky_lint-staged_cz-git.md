# 使用 `husky` + `lint-staged` + `cz-git` 助力团队编码规范

## 安装依赖

```bish
npm i -D husky lint-staged cz-git cross-env
```

## 修改 `package.json`

```json
"scripts": {
  "husky:init": "cross-env-shell \"npx husky init && echo 'npm run lint-staged' > .husky/pre-commit\"",
  "lint-staged": "lint-staged"
},
"devDependencies": {
  "cz-git": "^1.11.0",
  "husky": "^9.1.7",
  "lint-staged": "^10.5.4",
  "cross-env": "^7.0.3"
},
"config": {
  "commitizen": {
    "path": "cz-git"
  }
},
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
},
"lint-staged": {
  "*.{js}": [
    "eslint --fix",
    "git add"
  ],
  "*.{less,css}": [
    "stylelint --fix",
    "git add"
  ]
}
```

## 初始化 `husky`

```bish
npm run husky:init
```

## 效果

![企业微信截图_74417dba-7711-4bdf-9a0b-d6cf9e7c8547](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/企业微信截图_74417dba-7711-4bdf-9a0b-d6cf9e7c8547.png)
