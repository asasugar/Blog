# js继承 😆

## 总结一下自己学习的几种继承方式，包括原型继承、构造函数继承、组合继承、寄生组合继承和类式继承。

## 1.原型继承

### 其基本思想是利用原型让一个引用类型继承另一个引用类型的属性和方法。

- 示例代码
```js
function Kobe(){
    this.spirit = 'Mamba'
};

function Gigi(){};

Gigi.prototype = new Kobe; // 关键

var people = new Gigi();

console.log(people.spirit); // ==>'Mamba'

```

- 缺点：（1）包含`引用类型`值的原型属性会被所以实例共享，即一个实例修改属性会影响到另一个实例；（2）子类的实例无法向父类的构造函数传递参数
```js
function Kobe(){
    this.spirit = ['Mamba']; // 引用类型
};

function Gigi(){};

Gigi.prototype = new Kobe; // 关键

var people1 = new Gigi();

people1.spirit.push('Love');

console.log(people1.spirit); // ==>['Mamba', 'Love']

var people2 = new Gigi();

console.log(people2.spirit); // ==>['Mamba', 'Love']，影响到了people2实例

```
## 2.构造函数继承

### 2-1.其基本思想即在子类构造函数的内部调用父类构造函数。函数只不过是在特定环境中执行代码的对象，因此通过使用apply()和call()方法可以在新创建的对象上执行构造函数。

- 示例代码

```js
function Kobe(age){
    this.spirit = 'Mamba';
    this.age = age;
};

function Gigi(fatherAge){
  Kobe.call(this,fatherAge);  // 关键
};

var people = new Gigi(41); // 子类实例向父类传参

console.log(people.spirit); // ==>'Mamba'

console.log(people.age); // ==>41


```

### 2-2.对象冒充

```js
function Kobe(){
    this.spirit = 'Mamba'
};

function Gigi(){
  // 关键
  this.fn = Kobe;
  this.fn();
  delete this.fn;
};

var people = new Gigi();

console.log(people.spirit); // ==>'Mamba'

```



- 构造函数继承可以解决原型继承的两个缺点,但同时存在缺点：（1）方法都在构造函数中定义，因此无法复用函数；（2）在父类的原型中定义的方法，对子类而言是不可见的。

## 3.组合继承

### 指的是将原型链和借用构造函数的技术组合到一起。思路是使用原型链实现对原型方法的继承，而通过借用构造函数来实现对实例属性的继承。这样，既通过在原型上定义方法实现了函数的复用，又能够保证每个实例都有它自己的属性。

- 示例代码

```js
function Kobe(){
    this.spirit = 'Mamba';
};

function Gigi(){
  Kobe.call();  // 第二次调用父类构造函数
};

Gigi.prototype = new Kobe(); // 第一次调用父类构造函数,改变了子类的原型

Gigi.prototype.constructor = Gigi; // 因重写原型而失去constructor属性，所以要对constrcutor重新赋值

```
- 缺点：会调用两次父类的构造函数

## 4.寄生组合继承

### 即通过借用构造函数来继承属性，通过原型链的方式来继承方法，而不需要为子类指定原型而调用父类的构造函数，我们需要拿到的仅仅是父类原型的一个副本。因此可以通过传入子类和父类的构造函数作为参数，首先创建父类原型的一个复本，并为其添加constrcutor，最后赋给子类的原型。这样避免了调用两次父类的构造函数，为其创建多余的属性。

```js
function Kobe(){
    this.spirit = 'Mamba';
};

function Gigi(){};

// 创建父类原型副本
let prototype = Object.create(Kobe.prototype, {
  constructor: {
    value: Gigi,
    enumerable: false,
    writable: true,
    configurable: true
  }); 

Gigi.prototype = prototype; // 给子类原型赋值

```
## 5.class继承

```js
class Kobe {
  constructor() {
    this.spirit = 'Mamba';
  }
}
class Gigi extends Kobe {
  constructor(...args) {
    super(...args); // 关键，子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类自己的this对象必须先通过父类的构造函数完成塑造
  }
}

Gigi.prototype = prototype; // 给子类原型赋值

```