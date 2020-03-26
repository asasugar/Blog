# 数组去重

## Map 去重（效率最快）

```js
const arr = [1, 1, 4, 3, 2, 6];

const map = new Map();

let newArr = [];

for (let item of arr) {
  if (!map.get(item)) {
    map.set(item, 1);

    newArr.push(item);
  }
}

console.log(newArr); // [1, 4, 3, 2, 6]
```

## Set 去重（简洁）

```js
const arr = [1, 1, 4, 3, 2, 6];

const set = new Set(arr);

let newArr = [...set]; // 或 let newArr = Array.from(set);

console.log(newArr); // [1, 4, 3, 2, 6]
```

## Array.prototype.indexOf() 去重

```js
const arr = [1, 1, 4, 3, 2, 6];

// 方法一：
let newArr = arr.filter((item, index) => {
  return arr.indexOf(item) === index;
});

console.log(newArr); // [1, 4, 3, 2, 6]

// 方法二：
let newArr = [];
for (let item of arr) {
  if (newArr.indexOf(item) === -1) {
    newArr.push(item);
  }
}

console.log(newArr); // [1, 4, 3, 2, 6]
```

## Array.prototype.includes() 去重

```js
const arr = [1, 1, 4, 3, 2, 6];

let newArr = [];
arr.forEach(item => {
  if (!newArr.includes(item)) {
    newArr.push(item);
  }
});

console.log(newArr); // [1, 4, 3, 2, 6]
```

## Array.prototype.sort() 去重

```js
const arr = [1, 1, 4, 3, 2, 6];
arr = arr.sort();
arr.forEach((item, index) => {
  if (arr[index] !== arr[index + 1]) {
    newArr.push(arr[index]);
  }
});

console.log(newArr); // [1, 2, 3, 4, 6]
```

## for 循环 去重

```js
const arr = [1, 1, 4, 3, 2, 6];

let newArr = [];

for (let i = 0; i < arr.length; i++) {
  for (let j = i + 1; j < arr.length; j++) {
    if (arr[i] === arr[j]) {
      j = ++i;
    }
  }
  newArr.push(arr[i]);
}

console.log(newArr); // [1, 4, 3, 2, 6]
```

---

And So On ...
