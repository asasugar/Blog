# 支持AndroidX 😆

## 到2018年底，Android发布了Jetpack，其中包括对现在称为AndroidX的支持库的完整重写。



### 一、`gradle.properties`文件中将以下属性设置为true：

```properties
android.useAndroidX=true
android.enableJetifier=true
```


### 二、使用`react-native-jetifier`将生成索引（jetificableGroups.json）文件将在包根目录下创建（或更新，如果已有的话），其中包含所有依赖项（npm包）的可弹出对象

```bish
yarn add @jumpn/react-native-jetifier -D
```

#### 1、安装此软件包后，您将在node_modules / .bin文件夹下拥有一个名为react-native-jetifier的可执行文件

```bish
yarn react-native-jetifier
```

#### 2、在package.json中的npm postinstall脚本下添加它，以在删除或添加依赖项时保持依赖关系的清晰。

```bish
{
  "scripts": {
    "postinstall": "yarn react-native-jetifier"
  }
}
```

#### 3、将索引文件（jetificableGroups.json）提交到您的存储库