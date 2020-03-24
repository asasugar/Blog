# js源码手写系列 😆

- call的实现
```js
Function.prototype.call = function(context) {
  let context = context || window;
  context.fn = this;
  let args = [...arguments].slice(1);
  let result = context.fn(...args);
  delete context.fn;
  return result;
}
```

- apply的实现

```js
Function.prototype.apply = function(context) {
    let context = context || window;
    context.fn = this;
    let result;
    // 需要判断是否存储第二个参数
    if(arguments[1]) {
      result = context.fn(...arguments[1])
    } else {
      result = context.fn();
    }
    delete context.fn;
    return result;
}
```

- bind的实现

    bind 和其他两个方法作用也是一致的，只是该方法会返回一个函数。并且我们可以通过 bind 实现柯里化。
```js
Function.prototype.bind = function(context) {
    if (typeof this !== 'function') {
      throw new TypeError('Error')
    }
    let _this = this;
    let args = [...arguments].slice(1);
    // 返回一个函数
    return function F() {
      if(this instanceof F) {
        return new _this(...args, ...arguments); 
        // 相当于 return _this.apply(this, args.concat(...arguments))
      }
      return _this.apply(context, args.concat(...arguments));
    }
}
```

- new的实现

```js
function createNew() {
  let obj = new Object(); // 创建一个空对象
  let Con = [].shift.call(arguments); // 获得构造函数
  obj.__proto__ = Con.prototype; // 链接到原型
  let result = Con.apply(obj, arguments); // 绑定this，执行构造函数
  return typeof result === "object" ? result : obj; // 确保返回一个对象
}
```

- Object.create()的实现

```js
// 思路：将传入的对象作为原型
function _create(obj) {
  function F() {}
  F.prototype = obj
  return new F()
}
```

- instanceof的实现

```js
function _instanceof(left, right) {
    // 获得类型的原型
    let prototype = right.prototype
    // 获得对象的原型
    left = left.__proto__
    // 递归判断对象的类型是否等于类型的原型
    while (true) {
    	if (left === null)
    		return false
    	if (prototype === left)
    		return true
    	left = left.__proto__
    }
}
```

- 浅拷贝的实现

```js
let obj = {a:1}

// 方法一：
let newObj1 = {...obj};

// 方法二：
let newObj2 = Object.assign(obj);

// 方法三：
let newObj3 = {};
for(let key in obj) {
   if(!obj.hasOwnProperty(key)) break;
   newObj3[key] = obj[key];
}
```

- 深拷贝的实现

```js
function deepClone(obj) {
    // 过滤一些特殊情况
    if(obj === null) return null;
    if(typeof obj !== "object") return obj;
    if(obj instanceof RegExp) { // 正则
        return new RegExp(obj);
    }
    if(obj instanceof Date) { // 日期
        return new Date(obj);
    }
   
    let newObj = new obj.constructor; // 不直接创建空对象的目的：克隆的结果和之前保持所属类  =》 即能克隆普通对象，又能克隆某个实例对象
    for(let key in obj) {
        if(obj.hasOwnProperty(key)) {
             newObj[key] = deepClone(obj[key]);
        }
    }
    return newObj;
}
```

- 柯里化的实现

  柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数且返回结果的新函数的技术
```js
function curry(fn){
    var allArgs = [];

    return function next(){
        var args = [...arguments];
        if(args.length > 0){
            allArgs = allArgs.concat(args); // 收集传入的参数，通过闭包缓存
            return next;
        }else{
            return fn.apply(null, allArgs);
        }
    } 
}
var add = currying(function(){
    var sum = 0;
    for(var i = 0; i < arguments.length; i++){
        sum += arguments[i];
    }
    return sum;
});
add(1)(2)(); // 3
```

- 原生Ajax的实现

```js
function ajax(options) {
  let method = options.method || 'GET', // 不传则默认为GET请求
      params = options.params, // GET请求携带的参数
      data   = options.data, // POST请求传递的参数
      url    = options.url + (params ? '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&') : ''),
      async  = options.async === false ? false : true,
      success = options.success,
      headers = options.headers;

  let xhr;
  // 创建xhr对象
  if(window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }

  xhr.onreadystatechange = function() {
    if(xhr.readyState === 4 && xhr.status === 200) {
      success && success(xhr.responseText);
    }
  }

  xhr.open(method, url, async);
  
  if(headers) {
    Object.keys(Headers).forEach(key => xhr.setRequestHeader(key, headers[key]))
  }

  method === 'GET' ? xhr.send() : xhr.send(data)
}
```
