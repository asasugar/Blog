# vuepress 搭建你的个人博客

> 请确保你的 Node.js 版本 >= 8

## 将 VuePress 作为一个本地依赖安装
```bish
yarn add -D vuepress # 或者：npm install -D vuepress
```

## 添加 package.json 脚本

```json
{
  "scripts": {
    "serve": "vuepress dev docs --open",
    "build": "vuepress build docs",
  },
}
```

## 目录结构树

```js
├── docs
│   ├── .vuepress
│   │    ├── dist // 打包文件夹，将其添加到 git 忽略文件
│   │    ├── public // 图片资源
│   │    │         ├── favicon.png
│   │    │         └── hero.png
│   │    │         └── logo.png
│   │    └── config.js // 配置文件
│   ├── js // 文章
│   │    └── fn.md
│   ├── vue // 文章
│   │    └── vue-plugin.md
│   └──  ...
├── README.md
│   
│ 
├── CNAME // 若使用自定义域名
│ 
├── package.json
│ 

```

## 开始写作

```bish
# 新建一个 docs 文件夹
mkdir docs


# 新建一个 markdown 文件
echo '# Hello VuePress!' > docs/README.md


# 开始写作
yarn serve

```


## docs 文件夹下新建一个 .vuepress 文件夹

```bish
# 进入 docs 文件夹
cd docs

# 新建一个 .vuepress 文件夹
mkdir .vuepress

# 进入 .vuepress 文件夹
cd .vuepress


# 新建一个 public 文件夹, 用于存放图片资源
mkdir .vuepress

# 创建 config.js 文件， 用于设置 vuepress 配置项
type nul>config.js
```

## 配置首页，即 docs/README.md

```md
---
home: true
heroImage: /hero.png // 首页logo
heroText: null
tagline: 🤞 带着自己的影子回家的时候，才知道什么是寂寞和孤单
actionText: 最近更新 →
actionLink: /other/vuepress-blog.md
features:
- title: 简洁至上
  details: 以 Markdown 为中心的项目结构，以最少的配置帮助你专注于写作。
- title: Vue驱动
  details: 享受 Vue + webpack 的开发体验，在 Markdown 中使用 Vue 组件，同时可以使用 Vue 来开发自定义主题。
- title: 高性能
  details: VuePress 为每个页面预渲染生成静态的 HTML，同时在页面被加载的时候，将作为 SPA 运行。
footer: MIT Licensed | Copyright © 2020-present JsSoooooCool
---
```

## 配置 config.js
```js
module.exports = {
  base: '/',
  title: '随便写写',
  description: '🤞 带着自己的影子回家的时候，才知道什么是寂寞和孤单',
  head: [
    ['link', { rel: 'icon', href: `/favicon.png` }], // ico图标，存放在 public 文件下
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  plugins: ['@vuepress/back-to-top'],
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    repo: 'https://github.com/xxj95719/Blog', // 源码位置
    repoLabel: 'My GitHub',
    lastUpdated: '上次更新', // 基于 git 提交时间生成的上次更新时间
    docsDir: 'docs',
    editLinks: true,
    editLinkText: '帮助我改善此页面！',
    logo: '/logo.png', // 首页logo，存放在 public 文件下
    // 导航栏
    nav: [
      { text: 'Home', link: '/' },
    ],
    // 侧栏
    sidebar: [
      {
        title: 'JS',   // 必要的
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 1,    // 可选的, 默认值是 1
        children: [
          '/js/array-deduplication.md',
          '/js/evenbus.md',
          '/js/fn.md',
          '/js/debounceAndthrottle.md',
          '/js/event-loop.md',
          '/js/extends.md',
          '/js/handwriting-series.md'
        ]
      },
      {
        title: 'TS',
        collapsable: false,
        children: [
          '/ts/ts-I.md',
          '/ts/ts-II.md',
          '/ts/ts-III.md',
        ]
      },
      {
        title: 'Vue',
        collapsable: false,
        children: [
          '/vue/vue-plugin.md',
          '/vue/vue-render-component.md',
        ]
      },
      {
        title: 'React-Native',
        collapsable: false,
        children: [
          '/rn/mobx-react.md',
          '/rn/rn-eslint.md',
          '/rn/rn-rename-android.md',
          '/rn/rn-rename-ios.md',
          '/rn/rn-http.md',
          '/rn/rn-androidX.md',
          '/rn/rn-android-64K.md',
          '/rn/rn-set-version.md'
        ]
      },
      {
        title: '构建工具',
        collapsable: false,
        children: [
          '/buildTool/rollup.md',
          '/buildTool/webpack-optimizate.md'
        ]
      },
      {
        title: '其他杂项',
        collapsable: false,
        children: [
          '/other/git.md',
          '/other/standard.md',
          '/other/ssh-key.md',
          '/other/pdf-down.md',
          '/other/git-commit.md',
          '/other/vuepress-blog.md',
        ]
      }
    ]
  }
}
```

## 使用 gh-pages 发布到 github pages

安装本地依赖

```bish
yarn add -D gh-pages # 或者：npm install -D gh-pages
```

配置 package.json

```js
"scripts": {
  // "predeploy": "yarn build", // 默认 github.io 域名
  "predeploy": "yarn build && cp CNAME docs/.vuepress/dist", // 打包前复制 CNAME 自定义域名到 dist 文件夹
  "deploy": "gh-pages -d docs/.vuepress/dist",
},
```

配置 CNAME 自定义域名 

```CNAME
blog.xxjqepk.cn 
```

执行命令

```bish
yarn deploy // 会打包出 dist 文件夹，并自动发布到 gh-pages 分支
```

-----
# ⭐️[查看源码](https://github.com/asasugar/Blog)