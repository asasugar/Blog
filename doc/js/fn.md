# 箭头函数与普通函数的区别 😆

## this 指向不同

- 箭头函数不绑定 this，会捕获其所在的上下文的 this 值，作为自己的 this 值,任何方法都改变不了其指向，如 call() , bind() , apply()

- 普通函数的 this 指向调用它的那个对象

```js
const obj = {
  a: 10,
  b: () => {
    console.log(this.a); // undefined
    console.log(this); // Window {postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, frames: Window, …}
  },
  c: function() {
    console.log(this.a); // 10
    console.log(this); // {a: 10, b: ƒ, c: ƒ}
  }
};
obj.b();
obj.c();
```

```js
const obj = {
  a: 10,
  b: function() {
    console.log(this.a); //10
  },
  c: function() {
    return () => {
      console.log(this.a); //10
    };
  }
};
obj.b();
obj.c()();
```

## 箭头函数不绑定 arguments，取而代之用 rest 参数...

```js
function A(a) {
  console.log(arguments);
}
A(1, 2, 3, 4, 5); //  [1, 2, 3, 4, 5, callee: ƒ, Symbol(Symbol.iterator): ƒ]

let B = b => {
  console.log(arguments);
};
B(1, 2, 3, 4, 5); // Uncaught ReferenceError: arguments is not defined

let C = (...args) => {
  console.log(args);
};
C(1, 2, 3, 4, 5); // [1, 2, 3, 4, 5]
```

## 箭头函数是匿名函数，不能作为构造函数，不能使用 new

```js
let FunConstructor = () => {
  console.log("构造函数");
};

let fn = new FunConstructor();
```

![20190506160650.png](https://i.loli.net/2019/05/06/5ccfeb1d1c61e.png)

## 箭头函数通过 call() 或 apply() 方法调用一个函数时，只传入了一个参数，对 this 并没有影响

```js
let obj = {
  a: 10,
  b: function(n) {
    let f = n => n + this.a;
    return f(n);
  },
  c: function(n) {
    let f = n => n + this.a;
    let m = {
      a: 20
    };
    return f.call(m, n);
  }
};
console.log(obj.b(1)); // 11
console.log(obj.c(1)); // 11
```

## 箭头函数没有原型属性 prototype

```js
const a = () => {
  return 1;
};

function b() {
  return 2;
}

console.log(a.prototype); // undefined
console.log(b.prototype); // {constructor: ƒ}
```

## 箭头函数不能当做 Generator 函数,不能使用 yield 关键字

```js
function* helloWorldGenerator() {
  yield "hello";
  yield "world";
  return "ending";
}
var hw = helloWorldGenerator();
hw.next();
// { value: 'hello', done: false }

hw.next();
// { value: 'world', done: false }

hw.next();
// { value: 'ending', done: true }

hw.next();
// { value: undefined, done: true }
```
