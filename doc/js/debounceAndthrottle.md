# 防抖(debounce)与节流(throttle) 😆

## 防抖和节流目的都是为了防止函数多次的被调用，但是它们的区别在于：

- 防抖：在事件被触发n秒之后执行，如果在此期间多次触发事件，则重新开始计时，且函数只会执行`一次`
- 节流：如果持续触发一个事件，`每隔n秒执行一次`，所以节流会稀释函数的执行频率。

## 防抖思路：每次触发事件时都取消之前的延时调用方法

应用场景：输入框

```js
/**
 * 简单的防抖函数
 *
 * @param  {function} func        用户传入需要防抖的函数
 * @param  {number}   wait        等待时间
 * @param  {boolean}  immediate   设置为ture时，立即调用函数
 * @return {function}             返回客户调用函数
 */

const debounce = (func, wait, immediate) => {
  if (typeof func != 'function') {
    throw new TypeError('Expected a function');
  }
  wait = Number(wait) || 0;

  let timer = null;

  const later = (_this, _args) => setTimeout(() => {
    timer = null;
    if (!immediate) {
      func.apply(_this, _args)
    }
  }, wait);

  return function (...args) {

    if (!timer) {
      if (immediate) {
        func.apply(this, args);
      }
      timer = later(this, args);
    } else {
      clearTimeout(timer);
      timer = later(this, args);
    }
  }
}
```

## 节流思路：每次触发事件时都判断当前是否有等待执行的延时函数

应用场景：滚动条事件 或者 resize 事件，通常每隔 100~500 ms执行一次即可

```js
/**
 * 简单的节流函数
 *
 * @param  {function} func        用户传入需要节流的函数
 * @param  {number}   wait        等待时间
 * @param  {boolean}  immediate   设置为ture时，立即调用函数
 * @return {function}             返回客户调用函数
 */

const throttle = (func, wait, immediate) => {
  if (typeof func != 'function') {
    throw new TypeError('Expected a function');
  }
  wait = Number(wait) || 0;

  let timer = null;

  const later = (_this, _args) => setTimeout(() => {
    timer = null;
    if (!immediate) {
      func.apply(_this, _args);
      clearTimeout(timer);
    }
  }, wait);

  return function (...args) {

    if (!timer) {
      if (immediate) {
        func.apply(this, args);
        immediate = false;
      } else {
        timer = later(this, args);
      }
    }
  }
}
```