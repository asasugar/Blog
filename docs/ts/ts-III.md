# 通俗易懂的 TS 教程（下）

要讲的主要内容其实前面两章节都介绍的差不多了，这一趴主要做一些练习题。

### Q1. 基于如下类型，实现一个去掉了 `gender` 的新类型，实现方法越多越好

```ts
type User = {
  name: string;
  age: number;
  gender: string;
};
```

解法：

```ts
type T1 = Omit<User, 'gender'>;
type T2 = Pick<User, 'name' | 'age'>;
type T3 = Pick<User, Exclude<keyof User, 'gender'>>;
type T4 = { [P in 'name' | 'age']: User[P] };
type T5 = { [P in Exclude<keyof User, 'gender'>]: User[P] };
```

### Q2. 从上面几个工具类型的源码定义中我们可以发现，都只是简单的一层遍历，就好像 `js` 中的 `浅拷贝`，比如有下面这样一个对象

```ts
type User = {
  name: string;
  age: number;
  children: {
    boy: number;
    girl: number;
  };
};
```

要把这样一个对象所有属性都改成可选属性，用 `Partial` 就行不通了，它只能改变第一层，`children` 里的所有属性都改不了，所以请写一个可以实现的类型，功能类似深拷贝的意思

```ts
// Partial 源码定义
type Partial<T> = { [P in keyof T]?: T[P] };

// 递归 Partial
type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;
```

外层再加了一个三元表达式，如果不是对象类型直接返回，如果是就遍历；然后属性值改成递归调用就可以了

```ts
// 递归 Required
type DeepRequired<T> = T extends object
  ? { [P in keyof T]-?: DeepRequired<T[P]> }
  : T;

// 递归 Readonly
type DeepReadonly<T> = T extends object
  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
  : T;
```

### Q3. 请实现一个能去掉对象类型中 null 和 undefined 的类型

```ts
// 需要把如下类型变成 { name: string }
type User = {
  name: string;
  age: null;
  gender: undefined;
};

// 实现如下
type ObjNonNullable<T> = { [P in keyof T as T[P] extends null | undefined ? never : P]: T[P] };

type T1 = ObjNonNullable<User>
// type T1 = { name: string }

```

如上只能过滤对象第一层的 null 和 undefined

如何更进一步改成可以递归的呢？

```ts
type User = {
    name: string
    age: undefined,
    children: {
        boy: number
        girl: number
        neutral: null
    }
}
// 递归处理对象类型的 DeepNonNullable
type DeepNonNullable<T> = T extends object ? { [P in keyof T as T[P] extends null | undefined ? never : P]: DeepNonNullable<T[P]> } : T;

type T1 = DeepNonNullable<User>
// type T1 = {
//    name: string;
//    children: {
//        boy: number;
//        girl: number;
//    };
//}
```

### Q4. 请实现一个类型，把对象类型中的属性名换成大写，需要注意的是对象属性名支持 string | number | symbol 三种类型

```ts
type User1 = {
    name: string
    age: number
    18: number
}

// 实现如下，只需调用现在的工具类型 Uppercase 就行了

// 先取出所有字符串属性的出来，再处理返回 { NAME: string, AGE: number }
// type T1<T> = { [P in keyof T & string as Uppercase<P>]: T[P] }
// 只处理字符串属性的，其他正常返回
type T1<T> = { [P in keyof T as P extends string ? Uppercase<P> : P]: T[P] }

type T2 = T1<User1>
// type T2 = {
//     NAME: string;
//     AGE: number;
//     18: number
// }
```

### Q5. 请实现一个类型，可以把下划线属性名的对象，换成驼峰属性名的对象。这个就没有现成的工具类型调用了，所以需要我们额外实现一个

```ts
type User1 = {
    my_name: string
    my_age_type: number // 多个下划线
    my_children: {
        my_boy: number
        my_girl: number
    }
}

// 实现如下
type T1<T> = T extends string
	? T extends `${infer A}_${infer B}`
		? `${A}${T1<Capitalize<B>>}` // 这里有递归处理单个属性名多个下划线
		: T
	: T;
// 对象不递归
// type T2<T> = { [P in keyof T as T1<P>]: T[P] }
// 对象递归
type T2<T> = T extends object ? { [P in keyof T as T1<P>]: T2<T[P]> } : T

type T3 = T2<User1>
// type T3 = {
//     myName: string;
//     myAgeType: number;
//     myChildren: {
//         myBoy: number;
//         myGirl: number;
//     };
// }
```

这个练习用到了 `extends`、`infer`、`as`、`循环`、`递归`，相信能更好地帮助我们理解和运用
