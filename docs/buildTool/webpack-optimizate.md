# 兄 dei，是时候给你的 Webpack 做一波优化了~


# 体积篇

## 1. 开启 `gzip` 压缩（压缩率 70%）

前端配置

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

Nginx 配置

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

开启后前后对比效果图

![20190428095607.png](https://user-gold-cdn.xitu.io/2019/1/4/16818e8558ffa241?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 2. 配置 `externals` 使用 `cdn` 引入第三库

在 `index.html` 中使用 `<script>` 标签引入
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>CDN</title>
</head>
<body>
    <div id="App">App</div>
    <script
      src="https://code.jquery.com/jquery-1.12.4.min.js"
      integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ="
      crossorigin="anonymous">
    </script>
</body>
</html>

```

通过 import 的方式去引用(如 import $ from 'jquery')，并且希望 webpack 不会对其进行打包

```js
//webpack.config.js
module.exports = {
    //...
    externals: {
        'jquery': 'jQuery'
    }
};
```

## 3.devtoop 中的 `source-map` 与 css-loader 的 `sourceMap`

虽说生产环境使用 source-map 有助于查看 bug，但同时也会生成一个较大的 map 文件，你可以自行关闭

```js
const isPord = process.env.NODE_ENV === "production";

module.exports = {
  devtool: isPord ? false : 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        loader: 'css-loader',
        options: {
          sourceMap: isPord ? false : true,
        },
      },
    ],
  },
};
```

## 4.IgnorePlugin

使用场景：我们就可以使用 IgnorePlugin 在打包时忽略 `moment` 本地化内容

```js
//webpack.config.js
module.exports = {
    //...
    plugins: [
        //忽略 moment 下的 ./locale 目录
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
}

```

## 5.按需引入第三方 UI 库，以[Element](https://element.eleme.cn/#/zh-CN/component/installation)为例

借助 `babel-plugin-component`，我们可以只引入需要的组件，以达到减小项目体积的目的。

首先，安装 babel-plugin-component：

```bish
npm install babel-plugin-component -D
```

然后，将 `babel.config.js` 修改为：

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

## 6.tree-shaking

使用ES6的import 语法，那么在生产环境下，会自动移除没有使用到的代码。

## 7.`purgecss-webpack-plugin` 移除未使用的css

```js
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin');
module.exports = {
  ...
  plugins: [
      new PurgecssWebpackPlugin()
  ]
}
```

## 8.代码分割

webpack将根据以下条件自动分割块：

- 可以共享新块，或者模块来自node_modules文件夹
- 新的块将大于30kb（在min + gz之前）
- 按需加载块时并行请求的最大数量将小于或等于6
- 初始页面加载时并行请求的最大数量将小于或等于4
- 当试图满足最后两个条件时，最好使用较大的块。

```js
module.exports = {
  ...
  optimization: {
    splitChunks: {
        chunks: "async", // all，async 和 initial
        minSize: 30000, // 模块的最小体积
        minRemainingSize: 0, // webpack 5中引入了option选项，通过确保拆分后剩余的最小块大小超过限制来避免大小为零的模块
        maxSize: 0, // maxSize该选项旨在与HTTP / 2和长期缓存一起使
        minChunks: 1, // 模块的最小被引用次数
        maxAsyncRequests: 6, // 按需加载的最大并行请求数
        maxInitialRequests: 4, // 一个入口最大并行请求数
        automaticNameDelimiter: '~', // 文件名的连接符
        automaticNameMaxLength: 30, // 允许设置由生成的块名称的最大字符数
        cacheGroups: { // 缓存组
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10
            },
            default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
            }
        }
    }
  }
}
```

# 速度篇

## 1.减小文件搜索范围

设置别名（`alias`）在项目中可缩减引用路径

```js
//webpack.config.js
module.exports = {
  resolve: {
      alias: {
        '@': path.resolve(__dirname, "./src"),
      }
  }
};
```

设置 `modules` 指定寻找模块所对应的文件

```js
//webpack.config.js
module.exports = {
  resolve: {
      modules: [path.resolve(__dirname, 'node_modules')],
  }
};
```

## 2.exclude/include

`exclude`（指定排除的文件） 的优先级高于 `include`（指定包含的文件），尽量避免 `exclude`，推荐使用 `include`

```js
//webpack.config.js
module.exports = {
  ...
  module: {
      rules: [
          {
              test: /\.js[x]?$/,
              use: ['babel-loader'],
              include: [path.resolve(__dirname, 'src')]
          }
      ]
  }
};
```

## 3.noParse

使用场景：使用没有AMD/CommonJS规范版本的第三方库，希望webpack引入该模块但不进行转化和解析，可以配置 `noParse` 从而提高构建性能。

```js
//webpack.config.js
module.exports = {
  ...
  module: {
      noParse: /jquery|lodash/
  }
};
```

```js
module.exports = {
  //...
  module: {
    noParse: (content) => /jquery|lodash/.test(content)
  }
};
```

## 4.cache-loader

在一些性能开销较大的 `loader` 之前添加 `cache-loader`，将结果缓存中磁盘中。默认保存在 `node_modueles/.cache/cache-loader` 目录下

安装依赖

```bish
yarn add cache-loader -D
```

webpack配置
```js
//webpack.config.js
module.exports = {
  ...
  module: {
      rules: [
          {
              test: /\.js?$/,
              use: ['cache-loader','babel-loader'],
              include: path.resolve('src')
          }
      ]
  }
};
```
亦可使用 `babel-loader` 自带的 `cacheDirectory` 选项，效果差不大多
```js
//webpack.config.js
module.exports = {
  ...
  module: {
      rules: [
          {
              test: /\.js?$/,
              use: 'babel-loader?cacheDirectory', // babel-loader自带cacheDirectory属性
              include: path.resolve('src')
          }
      ]
  }
};
```

## 5.使用 autodll-webpack-plugin 插件

### 其中原理是，将特定的第三方 NPM 包模块提前构建 👌，然后通过页面引入。这不仅能够使得 vendor 文件可以大幅度减小，同时，也极大的提高了构建速度。

```js
const AutoDllWebpackPlugin = require('autodll-webpack-plugin');
module.exports = {
  ...
  plugins: [
      new AutoDllWebpackPlugin({
          inject: true, // 设为 true 就把 DLL bundles 插到 index.html 里
          path: './dll',
          debug: true,
          filename: '[name].[hash].js',
          entry: {
              vue: [
                  'vue'
              ]
          }
      })
  ]
}
```

## 6.`webpack4` 的打包性能足够好了，`dll` 提升效果有限，可以使用 `hard-source-webpack-plugin`

`hard-source-webpack-plugin` 为模块提供中间缓存，缓存默认的存放路径是: `node_modules/.cache/hard-source`

```js
//webpack.config.js
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  // ......
  plugins: [
    new HardSourceWebpackPlugin() // <- 直接加入这行代码就行
  ]
}
```

## 7.用 `Happypack` 来加速代码构建

### 处理思路是：将原有的 webpack 对 loader 的执行过程，从单一进程的形式扩展多进程模式，从而加速代码构建

```js
const Happypack = require('happypack');
module.exports = {
    //...
    module: {
        rules: [
            {
                test: /\.js[x]?$/,
                use: 'Happypack/loader?id=js',
                include: [path.resolve(__dirname, 'src')]
            }
        ]
    },
    plugins: [
        new Happypack({
            id: 'js', 
            use: ['babel-loader'] 
        })
    ]
}
```

## 8.thread-loader

```js
module.exports = {
    //...
    module: {
        rules: [
            {
                test: /\.js[x]?$/,
                include: [path.resolve(__dirname, 'src')],
                use: [
                  {
                    loader: "thread-loader",
                    // 有同样配置的 loader 会共享一个 worker 池(worker pool)
                    options: {
                      // 产生的 worker 的数量，默认是 cpu 的核心数
                      workers: 2,

                      // 一个 worker 进程中并行执行工作的数量
                      // 默认为 20
                      workerParallelJobs: 50,

                      // 额外的 node.js 参数
                      workerNodeArgs: ['--max-old-space-size', '1024'],

                      // 闲置时定时删除 worker 进程
                      // 默认为 500ms
                      // 可以设置为无穷大， 这样在监视模式(--watch)下可以保持 worker 持续存在
                      poolTimeout: 2000,

                      // 池(pool)分配给 worker 的工作数量
                      // 默认为 200
                      // 降低这个数值会降低总体的效率，但是会提升工作分布更均一
                      poolParallelJobs: 50,

                      // 池(pool)的名称
                      // 可以修改名称来创建其余选项都一样的池(pool)
                      name: "my-pool"
                    }
                  },
                  "babel-loader"
                ]
            }
        ]
    },
}
```