# 前端开发规范

🤞 工欲善其事必先利其器

## 一、命名规则

### 1、文件命名

文件夹/文件的命名统一用小写

保证项目有良好的可移植性，可跨平台
相关参考(http://www.ruanyifeng.com/blog/2017/02/filename-should-be-lowercase.html)

### 2、文件引用路径

因为文件命名统一小写，引用也需要注意大小写问题

### 3、js 变量

- 3.1 变量

  命名方式：小驼峰

  命名规范：前缀名词

  命名建议：语义化

  案例:

  ```js
  // 友好
  let maxCount = 10;
  let tableTitle = "LoginTable";

  // 不友好
  let setCount = 10;
  let getTitle = "LoginTable";
  ```

- 3.2 常量

  命名方式：全部大写

  命名规范：使用大写字母和下划线来组合命名，下划线用以分割单词

  命名建议：语义化

  案例:

  ```js
  const MAX_COUNT = 10;
  const URL = "https://github.com/asasugar";
  ```

- 3.3 函数

  命名方式：小驼峰式命名法

  命名规范：前缀应当为动词

  命名建议：语义化

  案例:

  ![20190429162226.png](https://i.loli.net/2019/04/29/5cc6b4434c933.png)

- 3.4 类、构造函数

  命名方式：大驼峰式命名法，首字母大写

  命名规范：前缀为名称

  命名建议：语义化

  案例:

  ```js
  class Person {
    public name: string;
    constructor(name) {
      this.name = name;
    }
  }
  const person = new Person('mevyn');
  ```

  公共属性和方法：跟变量和函数的命名一样。

  私有属性和方法：前缀为\_(下划线)，后面跟公共属性和方法一样的命名方式。

  案例:

  ```js
  class Person {
    private _name: string;
    constructor() { }
    // 公共方法
    getName() {
      return this._name;
    }
    // 公共方法
    setName(name) {
      this._name = name;
    }
  }
  const person = new Person();
  person.setName('mervyn');
  person.getName(); // ->mervyn
  ```

- 3.5 css（class、id）命名规则 BEM

  （1）class 命名使用 BEM 其实是块（block）、元素（element）、修饰符（modifier）的缩写，利用不同的区块，功能以及样式来给元素命名。这三个部分使用\_\_与--连接（这里用两个而不是一个是为了留下用于块儿的命名）。

  命名约定的模式如下：

  ```css
  .block{}
  .block__element{}
  .block--modifier{}

  block 代表了更高级别的抽象或组件
  block__element 代表 block 的后代，用于形成一个完整的 block 的整体
  block--modifier代表 block 的不同状态或不同版本
  ```

  （2）id 一般参与样式，命名的话使用驼峰，如果是给 js 调用钩子就需要设置为 js_xxxx 的方式

## 二、注释

### 1.单行注释

```js
// 这个函数的执行条件，执行结果大概说明

dosomthing();
```

### 2.多行注释

```js
/*
* xxxx  描述较多的时候可以使用多行注释
* xxxx

*/

dosomthing();
```

### 3.函数(方法)注释 参考 jsdoc

![20190429164606.png](https://i.loli.net/2019/04/29/5cc6b9cc67a45.png)

## 三、组件

每个 Vue 组件的代码建议不要超出 200 行，如果超出建议拆分组件；

组件一般情况下是可以拆成基础/ui 部分和业务部分，基础组件一般是承载呈现，基础功能，不和业务耦合部分；

业务组件一般包含业务功能业务特殊数据等等。

### 1.UI 组件/基础组件

开发的时候注意可拓展性，支持数据传参进行渲染，支持插槽 slot

设置有 mixin，mixin 中放了基础信息和方法

### 2.容器组件

和当前业务耦合性比较高，由多个基础组件组成，可承载当前页的业务接口请求和数据(vuex)

### 3.组件存放位置

和当前业务耦合性比较高，由多个基础组件组成，可承载当前页的业务接口请求和数据(vuex)

#### （1）ui 组件存放在 src/components/ 中,包含 xxx.vue 和 readme.md

- xxx.vue 表示 ui 部分
- readme.md 中描述组件的基本信息

#### （2）业务组件就放在业务模块部分即可

## 四、codeReview

### 1.规则

所有影响到以往流程的功能需求更改发版前都需要 codeReview

### 2.执行者

初级程序员可由中级程序员的执行 codeReview

中级程序员可由高级程序员执行 codeReview

以此类推

### 3.反馈

每次 codereView 都需要有反馈，要对本次 codeReview 负责

反馈内容基本如：

> 功能：本次主要修改了什么功能或者 bug

> 模块：本次发版影响的模块

> 代码问题：codeReview 过程中发现的代码问题，比如代码性能、写法、代码风格等

> 业务问题：比如发现了某某影响到其他模块的逻辑问题，如果没有发现就写：无

---
