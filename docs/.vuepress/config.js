module.exports = {
  base: '/',
  title: '随便写写',
  description: '🤞 带着自己的影子回家的时候，才知道什么是寂寞和孤单',
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    repo: 'https://blog.xxjkjqb.cn/',
    repoLabel: 'My GitHub',
    lastUpdated: '上次更新',
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
          '/vue/vue-majorization.md'
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
        ]
      },
      {
        title: '其他杂项',
        collapsable: false,
        children: [
          '/other/standard.md',
          '/other/ssh-key.md',
          '/other/pdf-down.md',
          '/other/git.md',
        ]
      }
    ]
  }
}