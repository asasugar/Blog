# importmap去做 Vite打包缓存“contentHash”

## 背景

[vite/issues-6928](https://github.com/vitejs/vite/issues/6928)
![20240521101047](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20240521101047.png)

## 根目录下新建 `assets/main-[contentHash].js`

```js
import('./module-[idHash].js');
```

## index.html增加脚本引用

```html
<!-- index.html -->
<script type="importmap">
  {
    "imports": {
      "./assets/module-[idHash].js": "./assets/module-[contentHash].js"
    }
  }
</script>
```
放在所有其他的script标签之前

## 效果对比

 1. 未修改文件时：两次打包对比
![20240521100709](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20240521100709.png)
![20240521100914](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20240521100914.png)

 2. 修改文件时：两次打包对比
![20240521100709](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20240521100709.png)
![20240521100956](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20240521100956.png)
