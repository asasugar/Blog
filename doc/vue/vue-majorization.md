# 兄 dei，是时候给你的 Vue 项目做一波优化了~ 😆

本文默认各位已经使用了动态路由、压缩 js、css 等常规操作…（常用的方式构建工具基本都已集成） 👇

# 体积篇

## 1. 开启 gzip 压缩（压缩率 70%）

### 前端配置

```js
// vue.config.js
const CompressionWebpackPlugin = require("compression-webpack-plugin");
module.exports = {
  chainWebpack: config => {
    if (isPord) {
      config
        .plugin("compression")
        .use(CompressionWebpackPlugin)
        .tap(args => {
          return [
            {
              test: /\.js$|\.html$|\.css/,
              threshold: 10240,
              deleteOriginalAssets: false
            }
          ];
        });
    }
  }
};
```

### Nginx 配置

```js
// 找到配置文件/usr/local/nginx/conf/nginx.conf
gzip on;
gzip_min_length 1k;
gzip_buffers 4 16k;
#gzip_http_version 1.0;
gzip_comp_level 2;
gzip_types text/plain application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
gzip_vary off;
gzip_disable "MSIE [1-6]\.";
//第1行：开启Gzip
//第2行：不压缩临界值，大于1K的才压缩，一般不用改
//第3行：buffer，就是，嗯，算了不解释了，不用改
//第4行：用了反向代理的话，末端通信是HTTP/1.0；有这句的话注释了就行了，默认是HTTP/1.1
//第5行：压缩级别，1-10，数字越大压缩的越好，时间也越长，看心情随便改吧
//第6行：进行压缩的文件类型，缺啥补啥就行了，JavaScript有两种写法，最好都写上吧，总有人抱怨js文件没有压缩，其实多写一种格式就行了
//第7行：跟缓存服务有关，on的话会在Header里增加"Vary:Accept-Encoding"，自己对照情况看着办吧
//第8行：IE6对Gzip不怎么友好，不给它Gzip了
```

### 开启后前后对比效果图

![20190428095607.png](https://user-gold-cdn.xitu.io/2019/1/4/16818e8558ffa241?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 2. 使用 cdn 引入第三库

### 根据 Node 环境自动区分加载压缩版与完整版，比如说：chrome 插件 Vue Devtools 必须是完整版才能使用；开发中的错误提示等

```js
// vue.config.js
const isPord = process.env.NODE_ENV === "production";
const cdn_dev = [
  "https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js",
  "https://unpkg.com/vue-router@3.0.1/dist/vue-router.js",
  "https://unpkg.com/vuex@3.0.1/dist/vuex.js",
  "https://unpkg.com/axios/dist/axios.js"
];
const cdn_prod = [
  "https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.min.js",
  "https://unpkg.com/vue-router@3.0.1/dist/vue-router.min.js",
  "https://unpkg.com/vuex@3.0.1/dist/vuex.min.js",
  "https://unpkg.com/axios/dist/axios.min.js"
];
const cdn = isPord ? cdn_prod : cdn_dev;
```

### 通过 html-webpack-plugin 插件传递 cdn

```js
module.exports = {
  chainWebpack: config => {
    if (isPord) {
      config.plugin("html").tap(args => {
        args[0].inject = true; //DLL
        args[0].cdn = cdn;
        return args;
      });
    }
  }
};
```

### 在 index.html 中动态引入

```html
<!-- 使用cdn加速引入js、当cdn加载失败使用本地资源 -->
<% for (var i = 0; i < htmlWebpackPlugin.options.cdn.length; i++) { %>
<script src="<%= htmlWebpackPlugin.options.cdn[i] %>"></script>
<% } %>
```

### 万一 cdn 挂了，所以我们需要本地下载压缩版的第三方库，cdn 加载失效时引入本地的资源

```html
<script>
  var lookUp = [
    {
        name: 'Vue',
        localUrl: './js/vue.min.js'
    },
    {
        name: 'axios',
        localUrl: './js/axios.min.js'
     },
    {
        name: 'VueRouter',
        localUrl: './js/vue-router.min.js'
    },
    {
        name: 'Vuex',
        localUrl: './js/vuex.min.js'
    },
  ]
  lookUp.forEach(function (item, index) {  var name = item.name  if (typeof window[name] == 'undefined') {      document.write(unescape("%3Cscript src=" + item.localUrl +            "%3E%3C/script%3E"));
    }
  })
</script>
```

## 3.devtoop 中的 source-map

### 虽说生产环境使用 source-map 有助于查看 bug，但同时也会生成一个较大的 map 文件，你可以自行关闭

```js
const isPord = process.env.NODE_ENV === "production";

module.exports = {
  productionSourceMap: isPord ? false : true,
  css: {
    sourceMap: isPord ? false : true
  }
};
```

## 4.按需引入第三方 UI 库，以[Element](https://element.eleme.cn/#/zh-CN/component/installation)为例

### 借助 babel-plugin-component，我们可以只引入需要的组件，以达到减小项目体积的目的。首先，安装 babel-plugin-component：

```bish
npm install babel-plugin-component -D
```

### 然后，将 babel.config.js 修改为：

```js
module.exports = {
  presets: ["@vue/app"],
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk"
      }
    ]
  ]
};
```

# 速度篇

## 1.减小文件搜索范围

### 设置别名（alias）在项目中可缩减引用路径

```js
module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set("@", path.resolve(__dirname, "./src"));
  }
};
```

## 2.使用 autodll-webpack-plugin 插件

### 其中原理是，将特定的第三方 NPM 包模块提前构建 👌，然后通过页面引入。这不仅能够使得 vendor 文件可以大幅度减小，同时，也极大的提高了构件速度。

```js
const AutoDllWebpackPlugin = require('autodll-webpack-plugin');
module.exports = {
  chainWebpack: config => {
      config.
          .plugin('autoDll')
          .use(AutoDllWebpackPlugin)
          .tap(args =>{               return [{
                   inject: true, // 需要给html-webpack-plugin插件设inject: true,可参考体积篇cdn第二点
                  debug: true,
                  path: './dll',
                  filename: '[name].[hash].js',
                  entry: {
                      vendor: [                          // 若未使用 cdn可以将常用的库都写进去
                          'echarts',                          // 'vue',
                          // 'vuex',
                          // 'vue-router',
                          // 'axios',
                          // '@xuexiongjie/iview',
                        ]
                  }
              }]
          }
  }
}
```

## 3.用[Happypack](https://github.com/amireh/happypack)来加速代码构建，Webpack4 推荐使用[thread-loader](https://github.com/webpack-contrib/thread-loader)

### 处理思路是：将原有的 webpack 对 loader 的执行过程，从单一进程的形式扩展多进程模式，从而加速代码构建

```js
const ThreadLoader = require("thread-loader");
module.exports = {
  chainWebpack: config => {
    // thread-loader
    config.module
      .rule("thread")
      .test(/\.js$/)
      .exclude.add(/node_modules/)
      .end()
      .use(ThreadLoader)
      .loader("thread-loader")
      .options({
        workers: os.cpus().length,
        workerParallelJobs: 50,
        workerNodeArgs: ["--max-old-space-size=1024"],
        poolRespawn: false,
        poolTimeout: 2000,
        poolParallelJobs: 50,
        name: "my-pool"
      })
      .end();
  };
}
```
