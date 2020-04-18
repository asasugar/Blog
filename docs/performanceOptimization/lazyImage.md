# 实现图片懒加载

## 方法一：clientHeight、scrollTop 和 offsetTop

首先给图片一个占位资源:

```html
<img src="imgUrl.jpg" data-src="http://www.xxx.com/imgUrl.jpg" /></img>
```

接着，通过监听 scroll 事件来判断图片是否到达视口:

```js
let imgs = document.getElementsByTagName("img");
let count = 0;//计数器，从第一张图片开始计

lazyload();//首次加载别忘了显示图片

window.addEventListener('scroll', lazyload);

function lazyload() {
  let viewHeight = document.documentElement.clientHeight;//视口高度
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;//滚动条卷去的高度
  for(let i = count; i < imgs.length; i++) {
    // 元素现在已经出现在视口中
    if(imgs[i].offsetTop < scrollHeight + viewHeight) {
      if(imgs[i].getAttribute("src") !== "imgUrl.jpg") continue;
      imgs[i].src = imgs[i].getAttribute("data-src");
      count ++;
    }
  }
}
```
当然，最好对 scroll 事件做节流处理，以免频繁触发:

```js
window.addEventListener('scroll', throttle(lazyload, 200));
```

## 方法二：getBoundingClientRect

方法返回元素的大小及其相对于视口的位置。

```js
// lazyload 函数改成下面这样:
function lazyload() {
  for(let i = count; i < imgs.length; i++) {
    // 元素现在已经出现在视口中
    if(imgs[i].getBoundingClientRect().top < document.documentElement.clientHeight) {
      if(imgs[i].getAttribute("src") !== "imgUrl.jpg") continue;
      imgs[i].src = imgs[i].getAttribute("data-src");
      count ++;
    }
  }
}
```

## 方法三：IntersectionObserver

这是浏览器内置的一个`API`，实现了监听 `window的scroll事件`、`判断是否在视口`中以及`节流`三大功能，不兼容ie,建议查询 `can i use` 后使用。

```js
let imgs = document.document.getElementsByTagName("img");

const observer = new IntersectionObserver(entries => {
  //entries 是被观察的元素集合
  for(let i = 0, len = entries.length; i < len; i++) {
    let entrie = entries[i];
    if(entrie.intersectionRatio<= 0) continue; // 如果intersectionRatio为0，则目标不在视线范围内
    const imgElement = entrie.target;
    imgElement.src = imgElement.getAttribute("data-src");
    observer.unobserve(imgElement); // 停止监听目标元素
  }
})
observer.observe(imgs); // 开始监听目标元素
```
