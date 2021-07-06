module.exports = {
  base: '/',
  title: '随便写写',
  description: '带着自己的影子回家的时候，才知道什么是寂寞和孤单',
  head: [
    ['link', { rel: 'icon', href: `/favicon.png` }],
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
    repo: 'https://github.com/asasugar/Blog',
    repoLabel: 'My GitHub',
    lastUpdated: '上次更新',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: '帮助我改善此页面！',
    logo: '/logo.png',
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
        title: 'Vue',
        collapsable: false,
        children: [
          '/vue/vue-plugin.md',
          '/vue/vue-render-component.md',
          '/vue/vuex.md',
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
          '/rn/rn-set-version.md',
          '/rn/rn-push.md'
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
        title: '前端性能优化',
        collapsable: false,
        children: [
          '/performanceOptimization/lazyImage.md',
        ]
      },
      {
        title: '其他',
        collapsable: false,
        children: [
          '/other/git.md',
          '/other/standard.md',
          '/other/ssh-key.md',
          '/other/pdf-down.md',
          '/other/git-commit.md',
          '/other/vuepress-blog.md',
          '/other/h5.md',
        ]
      }
    ]
  }
}