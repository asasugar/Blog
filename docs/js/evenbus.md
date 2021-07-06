# 如何实现一个简易的 evenBus？

## 废话不多说，直接上代码 👇

```js
export default class EvenBus {
  constructor(maxListeners) {
    this._events = this._events || new Map(); // 储存事件/回调键值对
    this._listeners = this._listeners || 0; // 当前监听数量
    this._maxListeners = maxListeners || 10; // 设立监听上限
  }
  // 监听
  on = (type, fn) => {
    let handle = this._events.get(type);
    if (!handle) {
      this._events.set(type, fn);
    } else if (handle && typeof handle === "function") {
      // 如果handle是函数说明只有一个监听者
      this._events.set(type, [handle, fn]);
    } else {
      handle.push(fn);
    }
    this.getListeners(type);
  };
  // 触发
  emit = (type, ...args) => {
    let handle = this._events.get(type);
    // 多个回调说明有多个监听
    if (Array.isArray(handle)) {
      for (let fn of handle) {
        if (args.length > 0) {
          fn.apply(this, args);
        } else {
          fn.call(this);
        }
      }
    } else {
      if (args.length > 0) {
        handle.apply(this, args);
      } else {
        handle.call(this);
      }
    }
  };
  // 移除
  remove = type => {
    if (type) {
      this._events.delete(type);
    } else {
      this._events.clear();
    }
  };
  // 计算当前监听数
  getListeners = type => {
    if (type) this._listeners++;
    if (this._listeners > this._maxListeners)
      throw "The current number of listens is greater than the maximum number";
    else return true;
  };
}
```

---

### 使用 rollup 发布 npm,可 👉[如何使用 rollup 构建代码？](https://github.com/asasugar/Blog/blob/master/docs/buildTool/rollup.md)
