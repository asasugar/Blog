# 如何让浏览器下载文件（eg:PDF、图片...），而不直接打开？ 😆

## 1、需求

放置在服务器上的文件，根据 url 在浏览器上下载，而不直接打开文件

## 2、实现思路

使用 ajax 请求文件 url，设置`responseType`为`blob`，然后再执行下载操作

## 3、实际代码

```js
const url = '你的文件地址';
let xhr = new XMLHttpRequest();
xhr.open('get', url, true);
xhr.responseType = 'blob';
xhr.onload = function() {
  if (this.status == 200) {
    const blob = this.response;
    if (blob.type === 'text/html') {
      return false;
    }
    const fileName = '自定义文件名称';
    if (window.navigator.msSaveOrOpenBlob) {
      // IE浏览器下
      navigator.msSaveBlob(blob, fileName);
    } else {
      // 其他浏览器
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);
    }
  }
};
xhr.onloadend = function(res) {};
xhr.send();
```
