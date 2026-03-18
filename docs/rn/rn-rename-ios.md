# 为rn修改包名`[iOS篇]`

## 一、Xcode部分

### 1.目光所及的都替换～（修改完回车，点击`rename`）
![20190819185554.png](https://i.loli.net/2019/08/19/ObrZln4SdWok3a1.png)

### 2.Xcode中test部分,把xxTests.m中的代码修改一下。

![20191203171125.png](https://i.loli.net/2019/12/03/gX5sYWhlaFNm9HP.png)

### 3.🔍`myApp`将其替换为`app`
![20190819185338.png](https://i.loli.net/2019/08/19/Mlq5hL3Qn2dieHb.png)

### 4.回到xcode项目，如果发现下面这些文件变红了，可以选中文件夹或者文件，然后在右侧工具那里来修改资源路径，如果改了文件夹的资源路径后，发现里面的文件还是变红的，那就要每个文件单独再修改一遍资源路径，方法不变。如果没有则滤过此步：
![20191203172252.png](https://i.loli.net/2019/12/03/9a5pBFYxdqZuWvb.png)

### 5.修改scheme,Product => Scheme => Manage Scheme ，这里你可以直接把原来的名字替换成新的名字。哦对了，这个地方不要双击，单击要改的地方按下回车就可以修改了

## 二、关闭xcode，重新run
```bash
yarn start --reset-cache
```

## 三、打开xcode，清除缓存，重新run
```bash
 Product=>clean
 Product=>run
```