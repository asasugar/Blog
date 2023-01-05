# 通俗易懂的 TS 教程（中）

## TS 进阶

这一部分的内容就需要费点脑细胞了，毕竟学习一门语言，还是没那么容易的，最好把基础的内容都理解透彻之后再来学进阶。

### 高级类型（一）

高级类型分一和二两部分，一的部分不需要理解泛型也能理解，二的部分需要理解泛型之后才能理解，所以二被拆分到后面去了。

> 联合类型

如果希望一个变量可以支持多种类型，就可以用联合类型（union types）`|` 来定义。

例如，一个变量既支持 number 类型，又支持 string 类型，就可以这么写：

```ts
let num: number | string;

num = 8;
num = 'eight';
```

联合类型大大提高了类型的可扩展性，但当 `TS` 不确定一个联合类型的变量到底是哪个类型的时候，只能访问他们共有的属性和方法。

比如这里就只能访问 `number` 类型和 `string` 类型共有的方法，如下图，

![20220328155259](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220328155259.png)

如果直接访问 `length` 属性，`string` 类型上有，`number` 类型上没有，就报错了，

![20220328155347](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220328155347.png)

> 交叉类型

如果要对对象形状进行扩展，可以使用交叉类型 `&`。

比如 Person 有 name 和 age 的属性，而 Student 在 name 和 age 的基础上还有 grade 属性，就可以这么写，

```ts
interface Person {
  name: string;
  age: number;
}

type Student = Person & { grade: number };
```

这和类的`继承`是一模一样的，这样 `Student` 就继承了 `Person` 上的属性，

> 类型别名（type）

类型别名（type aliase），听名字就很好理解，就是给类型起个别名。

就像我们项目中配置 `alias`，不用写相对路径就能很方便地引入文件

```js
import componentA from '../../../../components/componentA/index.vue';
// 变成
import componentA from '@/components/componentA/index.vue';
```

类型别名用 `type` 关键字来书写，有了类型别名，我们书写 `TS` 的时候可以更加方便简洁。

比如下面这个例子，`getName` 这个函数接收的参数可能是字符串，可能是函数，就可以这么写。

```ts
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver; // 联合类型
function getName(n: NameOrResolver): Name {
  if (typeof n === 'string') {
    return n;
  } else {
    return n();
  }
}
```

这样调用时传字符串和函数都可以

```ts
getName('Sugar');
getName(() => 'Sugar');
```

类型别名会给一个类型起个新名字。类型别名有时和接口很像，但是可以作用于原始值，联合类型，元组以及其它任何你需要手写的类型。-- TS 文档

类型别名的用法如下:

```ts
type Name = string; // 基本类型

type arrItem = number | string; // 联合类型

const arr: arrItem[] = [1, '2', 3];

type Person = {
  name: Name;
};

type Student = Person & { grade: number }; // 交叉类型

type Teacher = Person & { major: string };

type StudentAndTeacherList = [Student, Teacher]; // 元组类型

const list: StudentAndTeacherList = [
  { name: 'Sugar', grade: 100 },
  { name: 'Sugar', major: 'Chinese' },
];
```

#### type 和 interface 的区别

两者相同点：

- 都可以定义一个对象或函数
- 都允许继承

  `interface` 使用 `extends` 实现继承， `type` 使用 `交叉类型 &` 实现继承

两者不同点：

- `interface（接口）` 是 `TS` 设计出来用于`定义对象`类型的，可以对对象的形状进行描述。

- `type` 是类型别名，用于给各种类型定义`别名`，让 TS 写起来更简洁、清晰。

- `type` 可以声明基本类型、联合类型、交叉类型、元组，`interface` 不行

- interface 可以`合并重复声明`，type 不行

  合并重复声明：

  ```ts
  interface Person {
    name: string;
  }

  interface Person {
    // 重复声明 interface，就合并了
    age: number;
  }

  const person: Person = {
    name: 'Sugar',
    age: 24,
  };
  ```

  重复声明 type ，就报错了

  ```ts
  type Person = {
    name: string;
  };

  type Person = {
    // Duplicate identifier 'Person'
    age: number;
  };

  const person: Person = {
    name: 'Sugar',
    age: 24,
  };
  ```

  ![20220328161229](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220328161229.png)

这两者的区别说了这么多，其实本不该把这两个东西拿来做对比，他们俩是完全不同的概念。

`interface` 是接口，用于描述一个对象。

`type` 是类型别名，用于给各种类型定义别名，让 `TS` 写起来更简洁、清晰。

只是有时候两者都能实现同样的功能，才会经常被混淆

平时开发中，一般使用 `组合` 或者 `交叉类型` 的时候，用 `type`。

一般要用类的 `extends` 或 `implements` 时，用 `interface`。

其他情况，比如定义一个 `对象` 或者 `函数` ，就看你心情了。

> 类型保护

如果有一个 `getLength` 函数，入参是联合类型 `number | string`，返回入参的 `length`，

```ts
function getLength(arg: number | string): number {
  return arg.length;
}
```

从上文可知，这么写会报错，因为 number 类型上没有 length 属性。

![20220328161627](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220328161627.png)

这个时候，类型保护（Type Guards）出现了，可以使用 `typeof` 关键字判断变量的类型。

我们把 `getLength` 方法改造一下，就可以精准地获取到 `string` 类型的 `length` 属性了，

```ts
function getLength(arg: number | string): number {
  if (typeof arg === 'string') {
    return arg.length;
  } else {
    return arg.toString().length;
  }
}
```

之所以叫类型保护，就是为了能够在不同的分支条件中缩小范围，这样我们代码出错的几率就大大降低了。

> 类型断言

上文的例子也可以使用类型断言 `as` 来解决。

使用类型断言来告诉 TS，我（开发者）比你（编译器）更清楚这个参数是什么类型，你就别给我报错了，

```ts
function getLength(arg: number | string): number {
  const str = arg as string;
  if (str.length) {
    return str.length;
  } else {
    const number = arg as number;
    return number.toString().length;
  }
}
```

**_注意，类型断言不是类型转换，把一个类型断言成联合类型中不存在的类型会报错。_**

```ts
function getLength(arg: number | string): number {
  return (arg as number[]).length;
}
```

![20220328162441](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220328162441.png)

> 字面量类型

有时候，我们需要定义一些常量，就需要用到字面量类型，比如，

```ts
type ButtonSize = 'mini' | 'small' | 'normal' | 'large';

type Sex = '男' | '女';
```

这样就只能从这些定义的常量中取值，乱取值会报错，

![20220328162630](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220328162630.png)

### 泛型

泛型，是 TS 比较难理解的部分，拿下了泛型，对 TS 的理解就又上了一个台阶，对后续深入学习帮助很大。

> 为什么需要泛型？

如果你看过 TS 文档，一定看过这样两段话：

> 软件工程中，我们不仅要创建一致的定义良好的 API，同时也要考虑可重用性。组件不仅能够支持当前的数据类型，同时也能支持未来的数据类型，这在创建大型系统时为你提供了十分灵活的功能。

> _在像 C# 和 Java 这样的语言中，可以使用泛型来创建可重用的组件，一个组件可以支持多种类型的数据。这样用户就可以以自己的数据类型来使用组件。_

我觉得初学者应该要先明白为什么需要泛型这个东西，它解决了什么问题？而不是看这种拗口的定义。

我们还是先来看这样一个例子，体会一下泛型解决的问题吧。

定义一个 `print` 函数，这个函数的功能是把传入的参数打印出来，再返回这个参数，传入参数的类型是 `string`，函数返回类型为 `string`。

```ts
function print(arg: string): string {
  console.log(arg);
  return arg;
}
```

现在需求变了，我还需要打印 `number` 类型，怎么办？

可以使用联合类型来改造：

```ts
function print(arg: string | number): string | number {
  console.log(arg);
  return arg;
}
```

现在需求又变了，我还需要打印 string 数组、number 数组，甚至任何类型，怎么办？

有个笨方法，支持多少类型就写多少联合类型。

或者把参数类型改成 `any`。

```ts
function print(arg: any): any {
  console.log(arg);
  return arg;
}
```

且不说写 `any` 类型不好，毕竟在 `TS` 中尽量不要写 `any`。

而且这也不是我们想要的结果，只能说传入的值是 any 类型，输出的值是 any 类型，传入和返回并不是统一的。

这么写甚至还会出现 bug：

```ts
const res: string = print(123);
```

定义 `string` 类型来接收 `print` 函数的返回值，返回的是个 `number` 类型，TS 并不会报错提示我们。

这个时候，泛型就出现了，它可以轻松解决输入输出要一致的问题。

**_注意：泛型不是为了解决这一个问题设计出来的，泛型还解决了很多其他问题，这里是通过这个例子来引出泛型。_**

> 泛型基本使用

#### 处理函数参数

泛型的语法是 `<>` 里写类型参数，一般可以用 `T` 来表示。

```ts
function print<T>(arg: T): T {
  console.log(arg);
  return arg;
}
```

这样，我们就做到了输入和输出的类型统一，且可以输入输出任何类型。

如果类型不统一，就会报错：

![20220328163948](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220328163948.png)

泛型中的 `T` 就像一个 `占位符` 、或者说一个 `变量` ，在使用的时候可以把定义的类型像参数一样传入，它可以原封不动地输出。

我们在使用的时候可以有两种方式指定类型。

- 定义要使用的类型
- TS 类型推断，自动推导出类型

```ts
print<string>('hello'); // 定义 T 为 string

print('hello'); // TS 类型推断，自动推导类型为 string
```

我们知道，`type` 和 `interface` 都可以定义函数类型，也用泛型来写一下，

type 这么写：

```ts
type Print = <T>(arg: T) => T;
const printFn: Print = function print(arg) {
  console.log(arg);
  return arg;
};
```

interface 这么写：

```ts
interface Iprint<T> {
  (arg: T): T;
}
const printFn = function print<T>(arg: T) {
  console.log(arg);
  return arg;
};

const myPrint: Iprint<number> = printFn;
```

#### 默认参数

如果要给泛型加默认参数，可以这么写：

```ts
interface Iprint<T = number> {
  (arg: T): T;
}

function print<T>(arg: T) {
  console.log(arg);
  return arg;
}

const myPrint: Iprint = print;
```

这样默认就是 `number` 类型了，怎么样，是不是感觉 `T` 就如同函数参数一样呢？

#### 处理多个函数参数

现在有这么一个函数，传入一个只有两项的元组，交换元组的第 0 项和第 1 项，返回这个元组。

```ts
function swap(tuple) {
  return [tuple[1], tuple[0]];
}
```

这么写，我们就丧失了类型，用泛型来改造一下。

我们用 T 代表第 0 项的类型，用 U 代表第 1 项的类型。

```ts
function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]];
}
```

这样就可以实现了元组第 0 项和第 1 项类型的控制。

![20220328170628](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220328170628.png)

#### 函数副作用操作

泛型不仅可以很方便地约束函数的参数类型，还可以用在函数执行副作用操作的时候。

比如我们有一个通用的异步请求方法，想根据不同的 url 请求返回不同类型的数据。

```ts
async function request(url: string) {
  const res = await fetch(url);
  return res.json();
}
```

调一个获取用户信息的接口：

```ts
request('user/info').then((res) => {
  console.log(res);
});
```

这时候的返回结果 res 就是一个 any 类型，非常讨厌。

![20220328171040](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220328171040.png)

我们希望调用 API 都清晰的知道返回类型是什么数据结构，就可以这么做：

```ts
async function request<T>(url: string): Promise<T> {
  const res = await fetch(url);
  return res.json();
}

interface UserInfo {
  name: string;
  age: number;
}

request<UserInfo>('user/info').then((res) => {
  console.log(res);
});
```

这样就能很舒服地拿到接口返回的数据类型，开发效率大大提高：

![20220328171236](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220328171236.png)

> 约束泛型

假设现在有这么一个函数，打印传入参数的长度，我们这么写：

```ts
function printLength<T>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

因为不确定 T 是否有 length 属性，会报错：

![20220328171611](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220328171611.png)

那么现在我想约束这个泛型，一定要有 length 属性，怎么办？

可以和 `interface` 结合，来约束类型。

```ts
interface ILength {
  length: number;
}

function printLength<T extends ILength>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

这其中的关键就是 `<T extends ILength>`，让这个泛型继承接口 `ILength`，这样就能约束泛型。

我们定义的变量一定要有 length 属性，比如下面的 str、arr 和 obj，才可以通过 TS 编译。

```ts
const str = printLength('Sugar');
const arr = printLength([1, 2, 3]);
const obj = printLength({ length: 10 });
```

这个例子也再次印证了 `interface` 的 `duck typing`。

只要你有 `length` 属性，都符合约束，那就不管你是 str，arr 还是 obj，都没问题。

当然，我们定义一个不包含 length 属性的变量，比如数字，就会报错：

![20220328172009](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220328172009.png)

> 泛型的一些应用

使用泛型，可以在定义函数、接口或类的时候，不预先指定具体类型，而是在使用的时候再指定类型。

#### 泛型约束类

定义一个栈，有入栈和出栈两个方法，如果想入栈和出栈的元素类型统一，就可以这么写：

```ts
class Stack<T> {
  private data: T[] = [];
  push(item: T) {
    return this.data.push(item);
  }
  pop(): T | undefined {
    return this.data.pop();
  }
}
```

在定义实例的时候写类型，比如，入栈和出栈都要是 number 类型，就这么写：

```ts
const s1 = new Stack<number>();
```

这样，入栈一个字符串就会报错：

![20220328172709](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220328172709.png)

特别注意的是，泛型无法约束类的静态成员。

给 `pop` 方法定义 `static` 关键字，就报错了

![20220328172832](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220328172832.png)

#### 泛型约束接口

使用泛型，也可以对 `interface` 进行改造，让 interface 更灵活。

```ts
interface IKeyValue<T, U> {
  key: T;
  value: U;
}

const k1: IKeyValue<number, string> = { key: 24, value: 'Sugar' };
const k2: IKeyValue<string, number> = { key: 'Sugar', value: 24 };
```

#### 泛型定义数组

定义一个数组，我们之前是这么写的：

```ts
const arr: number[] = [1, 2, 3];
```

现在这么写也可以：

```ts
const arr: Array<number> = [1, 2, 3];
```

> 小结
> `泛型`（Generics），从字面上理解，泛型就是一般的，广泛的。

泛型是指在定义函数、接口或类的时候，不预先指定具体类型，而是在使用的时候再指定类型。

泛型中的 `T` 就像一个占位符、或者说一个变量，在使用的时候可以把定义的类型像参数一样传入，它可以原封不动地输出。

用一张图来总结一下泛型的好处：

![20220328173835](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220328173835.png)

### 高级类型（二）

> 索引类型

从对象中抽取一些属性的值，然后拼接成数组，可以这么写，

```ts
const userInfo = {
  name: 'Sugar',
  age: '24',
};

function getValues(userInfo: any, keys: string[]) {
  return keys.map((key) => userInfo[key]);
}

// 抽取指定属性的值
console.log(getValues(userInfo, ['name', 'age'])); // ['Sugar', '24']
// 抽取obj中没有的属性:
console.log(getValues(userInfo, ['sex', 'outlook'])); // [undefined, undefined]
```

虽然 `obj` 中并不包含 `sex` 和 `outlook` 属性,但 TS 编译器并未报错

此时使用 TS 索引类型,对这种情况做类型约束，实现动态属性的检查。

理解索引类型，需先理解 `keyof`（索引查询）、`T[K]`（索引访问） 和 `extends` (泛型约束)。

#### keyof（索引查询）

`keyof` 操作符可以用于获取某种类型的所有键，其返回类型是联合类型。

```ts
interface IPerson {
  name: string;
  age: number;
}

type Key = keyof IPerson; // 'name' | 'age'
```

上面的例子，`Key` 类型变成了一个 `字符串字面量`。

#### T[K]（索引访问）

`T[K]`，表示接口 `T` 的属性 `K` 所代表的类型，

```ts
interface IPerson {
  name: string;
  age: number;
}

let type1: IPerson['name']; // string
let type2: IPerson['age']; // number
```

#### extends (泛型约束)

`T extends U`，表示泛型变量可以通过继承某个类型，获得某些属性，之前讲过，复习一下，

```ts
interface ILength {
  length: number;
}

function printLength<T extends ILength>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

#### 检查动态属性

对索引类型的几个概念了解后,对 getValue 函数进行改造，实现对象上动态属性的检查。

改造前:

```ts
const userInfo = {
  name: 'Sugar',
  age: '24',
};

function getValues(userInfo: any, keys: string[]) {
  return keys.map((key) => userInfo[key]);
}
```

- 定义泛型 `T`、 `K` ，用于约束 `userInfo` 和 `keys`

- 为 `K` 增加一个泛型约束，使 `K` 继承 `userInfo` 的所有属性的联合类型, 即 `K extends keyof T`

改造后：

```ts
function getValues<T, K extends keyof T>(userInfo: T, keys: K[]): T[K][] {
  return keys.map((key) => userInfo[key]);
}
```

这样当我们指定不在对象里的属性时，就会报错，

![20220328175321](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220328175321.png)

> 映射类型

TS 允许将一个类型映射成另外一个类型。

#### in

介绍映射类型之前，先介绍一下 `in` 操作符，用来对联合类型实现遍历。

```ts
type Person = 'name' | 'school' | 'major';

type Obj = {
  [p in Person]: string;
};
```

#### Partial

`Partial<T>` 将 `T` 的所有属性映射为`可选`的，例如：

```ts
interface IPerson {
  name: string;
  age: number;
}

let p1: IPerson = {
  name: 'Sugar',
  age: 24,
};
```

使用了 `IPerson` 接口，就一定要传 `name` 和 `age` 属性，

![20220328175707](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220328175707.png)

使用 `Partial` 改造一下，就可以变成可选属性，

```ts
interface IPerson {
  name: string;
  age: number;
}

type IPartial = Partial<IPerson>;

let p1: IPartial = {};
```

#### Partial 原理

`Partial` 的实现用到了 `in` 和 `keyof`

```ts
/**
 * Make all properties in T optional
 */
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

- `[P in keyof T]` 遍历 `T` 上的所有属性
- `?:` 设置属性为可选的
- `T[P]` 设置类型为原来的类型

#### Readonly

`Readonly<T>` 将 `T` 的所有属性映射为 `只读` 的，例如：

```ts
interface IPerson {
  name: string;
  age: number;
}

type IReadOnly = Readonly<IPerson>;

let p1: IReadOnly = {
  name: 'Sugar',
  age: 24,
};
```

![20220328180130](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220328180130.png)

#### Readonly 原理

和 `Partial` 几乎完全一样，

```ts
/**
 * Make all properties in T readonly
 */
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

- `[P in keyof T]` 遍历 `T` 上的所有属性
- `readonly` 设置属性为可读的
- `T[P]` 设置类型为原来的类型

#### Pick

`Pick` 用于抽取对象子集，挑选一组属性并组成一个新的类型，例如：

```ts
interface IPerson {
  name: string;
  age: number;
  sex: string;
}

type IPick = Pick<IPerson, 'name' | 'age'>;

let p1: IPick = {
  name: 'Sugar',
  age: 24,
};
```

#### Pick 原理

```ts
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

Pick 映射类型有两个参数:

- 第一个参数 `T` ，表示要抽取的目标对象
- 第二个参数 `K` ，具有一个约束：K 一定要来自 T 所有属性字面量的联合类型

#### Record

上面三种映射类型官方称为 `同态` ,意思是只作用于 `obj` 属性而不会引入新的属性。

`Record` 是会创建新属性的 `非同态` 映射类型。

```ts
interface IPerson {
  name: string;
  age: number;
}

type IRecord = Record<string, IPerson>;

let personMap: IRecord = {
  person1: {
    name: 'Sugar',
    age: 24,
  },
  person2: {
    name: 'Xue',
    age: 25,
  },
};
```

#### Record 原理

```ts
/**
 * Construct a type with a set of properties K of type T
 */
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

Record 映射类型有两个参数:

- 第一个参数可以传入继承于 any 的任何值
- 第二个参数，作为新创建对象的值，被传入。

> 条件类型

```ts
T extends U ? X : Y
// 若类型 T 可被赋值给类型 U,那么结果类型就是 X 类型,否则就是 Y 类型
```

`Exclude` 和 `Extract` 的实现就用到了条件类型。

#### Exclude

`Exclude` 意思是不包含，`Exclude<T, U>` 会返回 `联合类型 T` 和 `联合类型 U` 不相交的部分。

```ts
type Test = Exclude<'a' | 'b' | 'c', 'a'>;
```

![20220328181452](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220328181452.png)

#### Exclude 原理

```ts
/**
 * Exclude from T those types that are assignable to U
 */
type Exclude<T, U> = T extends U ? never : T;
```

- `never` 表示一个不存在的类型
- never 与其他类型的 `联合` 后，为 `其他类型`

```ts
type Test = string | number | never;
```

![20220328181654](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220328181654.png)

#### Extract

`Extract<T, U>` 提取联合类型 `T` 和联合类型 `U` 的所有交集。

```ts
type Test = Extract<'key1' | 'key2', 'key1'>;
```

![20220329134250](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220329134250.png)

#### Extract 原理

```ts
/**
 * Extract from T those types that are assignable to U
 */
type Extract<T, U> = T extends U ? T : never;
```

> 工具类型（Utility Types）

为了方便开发者使用， TypeScript 内置了一些常用的工具类型。

上文介绍的`索引类型`、`映射类型`和`条件类型`都是工具类型。

除了上文介绍的，再介绍一些常用的，毕竟工具函数遇到了去查就行，死记硬背就太枯燥了，熟能生巧，写多了自然就熟悉了。

#### Omit

`Omit<T, U>`从类型 `T` 中剔除 `U` 中的所有属性。

```ts
interface IPerson {
  name: string;
  age: number;
}

type IOmit = Omit<IPerson, 'age'>;
```

![20220329134611](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220329134611.png)

#### Omit 原理

```ts
/**
 * Construct a type with the properties of T except for those in type K.
 */
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

`Pick` 用于挑选一组属性并组成一个新的类型，`Omit` 是剔除一些属性，留下剩余的，他们俩有点相反的感觉。

那么就可以用 `Pick 和 Exclude` 实现 Omit。

当然也可以不用 `Pick` 实现，

```ts
type Omit2<T, K extends keyof any> = {
  [P in Exclude<keyof T, K>]: T[P];
};
```

#### NonNullable

`NonNullable<T>` 用来过滤类型中的 `null` 及 `undefined` 类型。

```ts
type T0 = NonNullable<string | number | undefined>; // string | number
type T1 = NonNullable<string[] | null | undefined>; // string[]
```

#### NonNullable 原理

```ts
/**
 * Exclude null and undefined from T
 */
type NonNullable<T> = T extends null | undefined ? never : T;
```

#### Awaited

`Awaited<T>`：作用是获取 `async/await` 函数或 `promise` 的 `then()` 方法的返回值的类型。而且自带递归效果，如果是这样嵌套的异步方法，也能拿到最终的返回值类型

```ts
// Promise
type T1 = Awaited<Promise<string>>;
// type T1 = string

// 嵌套 Promise，会递归
type T2 = Awaited<Promise<Promise<number>>>;
// type T2 = number

// 联合类型，会触发分发
type T3 = Awaited<boolean | Promise<number>>;
// type T3 = number | boolean
```

#### Awaited 原理

```ts
/**
 * Recursively unwraps the "awaited type" of a type. Non-promise "thenables" should resolve to `never`. This emulates the behavior of `await`.
 */
type Awaited<T> = T extends null | undefined
  ? T // special case for `null | undefined` when not in `--strictNullChecks` mode
  : T extends object & { then(onfulfilled: infer F, ...args: infer _): any } // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
  ? F extends (value: infer V, ...args: infer _) => any // if the argument to `then` is callable, extracts the first argument
    ? Awaited<V> // recursively unwrap the value
    : never // the argument to `then` was not callable
  : T; // non-object or non-thenable
```

1. 如果 T 是 null 或 undefined 就直接返回 T
2. 如果 T 是对象类型，并且里面有 then 方法，就用 infer 类型推断出 then 方法的第一个参数 onfulfilled 的类型赋值给 F，onfulfilled 其实就是我们熟悉的 resolve。所以这里可以看出或者准确的说，Awaited 拿的不是 then() 的返回值类型，而是 resolve() 的返回值类型

   - 既然 F 是回调函数 resolve ，就推断出该函数第一个参数类型赋值给 V ，resolve 的参数自然就是返回值
     - 传入 V 递归调用
   - F 不是函数就返回 never

3. 如果 T 不是对象类型 或者 是对象但没有 then 方法，返回 T ，就是最后一行的 T

#### Parameters

`Parameters` 获取函数的参数类型，将每个参数类型放在一个元组中。

```ts
type T1 = Parameters<() => string>; // []

type T2 = Parameters<(arg: string) => void>; // [string]

type T3 = Parameters<(arg1: string, arg2: number) => void>; // [arg1: string, arg2: number]
```

#### Parameters 原理

```ts
/**
 * Obtain the parameters of a function type in a tuple
 */
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
```

在条件类型语句中，可以用 `infer` 声明一个类型变量并且对它进行使用。

- `Parameters` 首先约束参数 `T` 必须是个函数类型
- 判断 `T` 是否是函数类型，如果是则使用 `infer P` 暂时存一下函数的参数类型，后面的语句直接用 `P` 即可得到这个类型并返回，否则就返回 `never`

#### ReturnType

`ReturnType` 获取函数的返回值类型。

```ts
type T0 = ReturnType<() => string>; // string

type T1 = ReturnType<(s: string) => void>; // void

type T2 = ReturnType<(s: string) => Promise<string>>; // Promise<string>
```

#### ReturnType 原理

```ts
/**
 * Obtain the return type of a function type
 */
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;
```

懂了 `Parameters`，也就懂了 `ReturnType`，

- `ReturnType` 首先约束参数 `T` 必须是个函数类型
- 判断 `T` 是否是函数类型，如果是则使用 `infer R` 暂时存一下函数的返回值类型，后面的语句直接用 `R` 即可得到这个类型并返回，否则就返回 `any`

#### ConstructorParameters/InstanceType

我们知道 `Parameters` 和 `ReturnType` 这一对是获取普通/箭头函数的参数类型集合以及返回值类型的了，还有一对组合 `ConstructorParameters` 和 `InstanceType` 是获取构造函数的参数类型集合以及返回值类型的，和上面的比较类似

#### Uppercase/Lowercase

转换全部字母大小写

```ts
type T1 = Uppercase<'abcd'>;
// type T1 = "ABCD"

type T2 = Lowercase<'ABCD'>;
// type T2 = "abcd"
```

#### Capitalize/Uncapitalize

转换首字母大小写

```ts
type T1 = Capitalize<'abcd'>;
// type T1 = "Abcd"

type T2 = Uncapitalize<'ABCD'>;
// type T2 = "aBCD"
```

> 类型体操是什么？

在本节中，我们熟悉了很多工具类型的作用和原理，其实已经在不知不觉中做了一些 `类型体操` 了

TypeScript 高级类型会根据类型参数求出新的类型，这个过程会涉及一系列的类型计算逻辑，这些类型计算逻辑就叫做类型体操。当然，这并不是一个正式的概念，只是社区的戏称，因为有的类型计算逻辑是比较复杂的。

想一想我们之前研究的这些工具类型，都是在对类型做计算返回新的类型啊。

Ts 是一门图灵完备的编程语言，即类型的可编码化，可以通过代码逻辑生成指定的各种类型，基于这点，才会有各种类型体操。

### TS 声明文件

> declare

当使用第三方库时，很多三方库不是用 TS 写的，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能。

比如，在 TS 中直接使用 Vue，就会报错，

```ts
const app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
  },
});
```

![20220329140556](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20220329140556.png)

这时，我们可以使用 declare 关键字来定义 Vue 的类型，简单写一个模拟一下，

```ts
interface VueOption {
  el: string;
  data: any;
}

declare class Vue {
  options: VueOption;
  constructor(options: VueOption);
}

const app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
  },
});
```

这样就不会报错了，使用 `declare` 关键字，相当于告诉 TS 编译器，这个变量（Vue）的类型已经在其他地方定义了，你直接拿去用，别报错。

需要注意的是，`declare class Vue` 并没有真的定义一个类，只是定义了类 Vue 的 `类型` ，仅仅会用于 `编译时` 的检查，在编译结果中会被删除。它编译结果不变。

> .d.ts 声明文件

通常我们会把声明语句放到一个单独的文件（`evn.d.ts`）中，这就是声明文件，以 `.d.ts` 为后缀。

```ts
// src/evn.d.ts
/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'qs';

declare module 'mockjs';

declare module '*.json' {
  const value: any;
  export default value;
}
```

一般来说，`ts` 会解析项目中所有的 `*.ts` 文件，当然也包含以 `.d.ts` 结尾的文件。所以当我们将 `evn.d.ts` 放到项目中时，其他所有 `*.ts` 文件就都可以获得类型定义了。

> 使用三方库

那么当我们使用三方库的时候，是不是所有的三方库都要写一大堆 decare 的文件呢？

答案是不一定，要看社区里有没有这个三方库的 TS 类型包（一般都有）。

社区使用 `@types` 统一管理第三方库的声明文件，是由 `DefinitelyTyped` 这个组织统一管理的

比如安装 `lodash` 的类型包

```bish
pnpm add @types/lodash -D
```

当然，如果一个库本来就是 TS 写的，就不用担心类型文件的问题，比如 `Vue3`。

> 自己写声明文件

比如你以前写了一个请求小模块 `myFetch`，代码如下，

```js
function myFetch(url, method, data) {
  return fetch(url, {
    body: data ? JSON.stringify(data) : '',
    method,
  }).then((res) => res.json());
}

myFetch.get = (url) => {
  return myFetch(url, 'GET');
};

myFetch.post = (url, data) => {
  return myFetch(url, 'POST', data);
};

export default myFetch;
```

现在新项目用了 `TS` 了，要在新项目中继续用这个 `myFetch`，你有两种选择：

- 用 `TS 重写` myFetch，新项目引重写的 `myFetch`[**推荐**]
- 直接引 `myFetch` ，给它写 `声明文件`

如果选择第二种方案，就可以这么做，

```ts
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

declare function myFetch<T = any>(
  url: string,
  method: HTTPMethod,
  data?: any
): Promise<T>;

declare namespace myFetch {
  // 使用 namespace 来声明对象下的属性和方法
  const get: <T = any>(url: string) => Promise<T>;
  const post: <T = any>(url: string, data: any) => Promise<T>;
}
```

比较麻烦的是需要配置才行，可以有两种选择，

1.创建一个 `node_modules/@types/myFetch/index.d.ts` 文件，存放 `myFetch` 模块的声明文件。这种方式不需要额外的配置

2.创建一个 `types` 目录，专门用来管理自己写的声明文件，将 `myFetch` 的声明文件放到 `types/myFetch/index.d.ts` 中[**推荐**]

```ts
// tsconfig.json
{
    "compilerOptions": {
        "module": "commonjs",
        "baseUrl": "./",
        "paths": {
            "*": ["types/*"]
        }
    }
}
```

直接用 TS 重写比给老项目写声明文件更好，这样就不用专门维护类型模块了。
