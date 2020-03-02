# Event Loop （浏览器端）😆

## js 引擎是单线程，也就是说每次只能执行一项任务，其他任务都得按照顺序排队等待被执行，只有当前的任务执行完成之后才会往下执行下一个任务。

## 1、es6之前的event loop（同步任务、微任务）

### 同步任务（同步代码）、异步任务（DOM操作相关、定时器相关回调、ajax回调）：

- 同步任务会在执行栈（先进后出）中按照顺序排队等待主线程的执行，当碰到异步任务时会挂起，在异步有了结果之后将回调加入消息队列（先进先出）中等待主线程空闲时，被读取到执行栈中等待主线程执行


- 示例代码
```js
console.log(1); // 同步任务

setTimeout(() => { // 异步任务，先挂起
  console.log(2);
});

console.log(3); // 同步任务

// 输出顺序： 1、3、2
```

## 2、es6之后的event loop（宏任务、微任务）


### es6之后将同步任务、定时器回调相关、ajax回调、IO、UI Render都归属于宏任务（tasks），同时浏览器端Promise回调、Object.observe、MutationObserver归属于微任务（jobs）

- 宏任务主代码块（script）按照顺序执行，当碰到宏任务中的异步任务时也是会被挂起，在异步有了结果之后将回调加入宏任务队列，主代码块查询是否有需要执行的微任务，有的话执行所有微任务，当主线程空闲时，异步任务被读取到执行栈中执行，然后查询是否有需要执行的微任务，有的话执行所有微任务

```js
console.log(1); // 主代码块宏任务

setTimeout(() => { // setTimeout宏任务，先挂起
  new Promise((resolve, reject) => {
    console.log(6); // setTimeout宏任务
    resolve();
  }).then(() => {
    console.log(7) // setTimeout微任务
  })
  console.log(2); // setTimeout宏任务
});

new Promise((resolve, reject) => {
  console.log(3); // 主代码块宏任务
  resolve();
}).then(() => {
  console.log(4) // 主代码块微任务
})
console.log(5); // 主代码块宏任务

// 输出顺序： 1、3、5、4、6、2、7
```

