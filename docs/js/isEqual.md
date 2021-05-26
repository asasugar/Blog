# 深度对比两个值是否相等

```js
// 深度对比两个值是否相等
function isEqual(value, other) {
  // 复杂类型
  if(typeof value === 'object' && typeof other === 'object') {
    if (value instanceof Array && other instanceof Array) {
      return equalArray(value, other);
    } else if (value instanceof Object && value instanceof Object) {
      return equalObject(value, other);
    } 
    return false;
  } 
  // 简单类型
  return value === other;
}
// 对比数组是否相等
function equalArray (arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0, l = arr1.length; i < l; i++) {
    if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
      if (!equalArray(arr1[i], arr2[i])) return false;
    } else if (arr1[i] instanceof Object && arr2[i] instanceof Object) {
      if (!equalObject(arr1[i], arr2[i])) return false;
    } else if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}
// 对比对象是否相等
function equalObject (obj1, obj2) {
  if(Object.keys(obj1).length !== Object.keys(obj2).length) return false;
  for (const prop in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, prop) !== Object.prototype.hasOwnProperty.call(obj2, prop)) return false;
    else if (typeof obj1[prop] !== typeof obj2[prop]) return false;

    if (obj1[prop] instanceof Array && obj2[prop] instanceof Array) {
      if (!equalArray(obj1[prop], obj2[prop])) return false;
    } else if (obj1[prop] instanceof Object && obj2[prop] instanceof Object) {
      if (!equalObject(obj1[prop], obj2[prop]))  return false;
    } else if (obj1[prop] !== obj2[prop]) return false;
  }
  return true;
}
```