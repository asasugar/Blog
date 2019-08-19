# 为rn修改包名`[iOS篇]` 😆

## 一、编辑器部分

### 将`myapp`改为`app`🔧通过编辑器全局搜索`myapp`，找出相关文件，修改

## 二、Xcode部分

### 1.🔍`myApp`将其替换为`app`
![20190819185338.png](https://i.loli.net/2019/08/19/Mlq5hL3Qn2dieHb.png)

```bish
npm i react-native-rename -g
```

### 2.目光所及的都替换～
![20190819185554.png](https://i.loli.net/2019/08/19/ObrZln4SdWok3a1.png)

```bish
react-native-rename "app" -b com.rn.app
```

## 三、关闭xcode，重新run
```bish
yarn start --reset-cache
```

## 四、打开xcode，清除缓存，重新run
```bish
 Product=>clean
 Product=>run
```