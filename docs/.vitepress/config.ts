import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '随便写写',
  description: '带着自己的影子回家的时候，才知道什么是寂寞和孤单',
  base: '/',
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],

  markdown: {
    lineNumbers: true,
  },

  themeConfig: {
    search: {
      provider: 'local'
    },
    // https://vitepress.dev/reference/default-theme-config
    lastUpdatedText: '上次更新',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/asasugar/Blog' }
    ],

    logo: {
       src: '/logo.png', width: 24, height: 24
    },

    editLink: {
      pattern: 'https://github.com/asasugar/Blog/edit/master/docs/:path',
      text: '帮助我改善此页面！'
    },

    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: 'SuperSpec', link: 'https://github.com/asasugar/SuperSpec' },
      { text: '最近更新', link: '/buildTool/ollama-linux-deploy' },
    ],

    sidebar: {
      '/': [
        {
          text: 'AI',
          collapsed: false,
          items: [
            { text: 'nanobot openai_codex 如何支持自定义 Responses', link: '/ai/nanobot-openaicodex-customResponse' },
            { text: 'nanobot 修改与调试过程', link: '/ai/nanobot-debug' },
            { text: 'Ollama Linux 服务器本地部署', link: '/ai/ollama-linux-deploy' },
          ]
        },
        {
          text: 'JS',
          collapsed: false,
          items: [
            { text: '数组去重', link: '/js/array-deduplication' },
            { text: 'EventBus', link: '/js/evenbus' },
            { text: '函数', link: '/js/fn' },
            { text: '防抖与节流', link: '/js/debounceAndthrottle' },
            { text: '事件循环', link: '/js/event-loop' },
            { text: '继承', link: '/js/extends' },
            { text: '手写系列', link: '/js/handwriting-series' },
            { text: 'isEqual', link: '/js/isEqual' },
            { text: 'Axios', link: '/js/axios' },
          ]
        },
        {
          text: 'TS',
          collapsed: false,
          items: [
            { text: 'TypeScript I', link: '/ts/ts-I' },
            { text: 'TypeScript II', link: '/ts/ts-II' },
            { text: 'TypeScript III', link: '/ts/ts-III' },
          ]
        },
        {
          text: 'Vue',
          collapsed: false,
          items: [
            { text: 'Vue 插件', link: '/vue/vue-plugin' },
            { text: 'Vue 渲染组件', link: '/vue/vue-render-component' },
            { text: 'Vuex', link: '/vue/vuex' },
            { text: 'Vue Router@4 addRoutes', link: '/vue/vue-router@4-addRoutes' },
          ]
        },
        {
          text: 'React Native',
          collapsed: false,
          items: [
            { text: 'Mobx React', link: '/rn/mobx-react' },
            { text: 'RN ESLint', link: '/rn/rn-eslint' },
            { text: 'RN 重命名 Android', link: '/rn/rn-rename-android' },
            { text: 'RN 重命名 iOS', link: '/rn/rn-rename-ios' },
            { text: 'RN HTTP', link: '/rn/rn-http' },
            { text: 'RN AndroidX', link: '/rn/rn-androidX' },
            { text: 'RN Android 64K', link: '/rn/rn-android-64K' },
            { text: 'RN 设置版本', link: '/rn/rn-set-version' },
            { text: 'RN Push', link: '/rn/rn-push' },
          ]
        },
        {
          text: '构建工具',
          collapsed: false,
          items: [
            { text: 'Docker 与 Docker Compose 通用实战指南', link: '/buildTool/docker' },
            { text: 'Rollup', link: '/buildTool/rollup' },
            { text: 'Webpack 优化', link: '/buildTool/webpack-optimizate' },
            { text: 'Import Map', link: '/buildTool/importmap' },
            { text: 'package.json', link: '/buildTool/package-json' },
            { text: 'Rspack', link: '/buildTool/rspack' },
          ]
        },
        {
          text: '前端性能优化',
          collapsed: false,
          items: [
            { text: '图片懒加载', link: '/performanceOptimization/lazyImage' },
          ]
        },
        {
          text: '其他',
          collapsed: false,
          items: [
            { text: 'SSH Key', link: '/other/ssh-key' },
            { text: 'Git', link: '/other/git' },
            { text: 'Git Commit', link: '/other/git-commit' },
            { text: 'Husky + lint-staged + cz-git', link: '/other/husky_lint-staged_cz-git' },
            { text: 'Standard', link: '/other/standard' },
            { text: 'PDF 下载', link: '/other/pdf-down' },
            { text: 'VuePress 博客', link: '/other/vuepress-blog' },
            { text: 'H5', link: '/other/h5' },
            { text: 'Skyline', link: '/other/skyline' },
            { text: 'Patch Package', link: '/other/patch-package' },
            { text: 'AWS IP 轮换', link: '/other/aws-ip-rotation' },
            { text: 'QQ IMAP Cloudflare', link: '/other/qq-imap-cloudflare' },
            { text: 'VPN Setup', link: '/other/vpn-setup' },
            { text: 'Outlook OAuth2 IMAP', link: '/other/outlook-oauth2-imap' },
          ]
        }
      ]
    },

    // 页脚
    footer: {
      copyright: 'Copyright © 2019-present <a href="https://github.com/asasugar">Jay Hsueh</a>'
    }
  }
})
