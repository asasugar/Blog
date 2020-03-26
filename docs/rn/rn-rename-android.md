# 为rn修改包名`[Android篇]`

# 通过`react-native init myapp`命令生成的包名为`com.myapp`,目标是改为`com.rn.app`

## 🔧通过编辑器全局搜索`myapp`，找出相关文件，修改完记得`cd android && ./gradlew clean`，然后再重新编译

---
## 一、手动更改

### 1.找到 MainActivity.java | MainApplication.java
```bish
android/app/src/main/java/com/myapp/MainActivity.java
android/app/src/main/java/com/myapp/MainApplication.java
```
### 2.修改第一行package
```java
package com.rn.app;
```
 MainActivity.java getMainComponentName 的返回值需要跟rn注册的名称一致

```java
@Override
protected String getMainComponentName() {
    return "haidaiApp";
}
```
### 3.根据目录层级在com下新建rn文件，rn下新建app文件夹，将两个java文件移入，并删除原有com下app文件夹

调整后结构如下：

```bish
android/app/src/main/java/com/rn/app/MainActivity.java
android/app/src/main/java/com/rn/app/MainApplication.java

```

### 4.修改Android的描述文件android/app/src/main/AndroidManifest.xml的package

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="com.rn.app">
  ...
</manifest>
```

### 5.修改俩个打包脚本
- android/app/BUCK

  ```js
  android_build_config(
      ...
      package = "com.rn.app",
  )

  android_resource(
      ...
      package = "com.rn.app",
      ...
  )
  ```
- android/app/build.gradle

  ```js
  defaultConfig {
      applicationId "com.rn.app"
      ...
  }
  ```

### 6.修改android/settings.gradle

```gradle
rootProject.name = 'app'
```

### 7.修改app.json

```json
{
  "name": "app",
  "displayName": "haidaiApp",
}
```

### 8.package.json

```json
{
  "name": "app",
}
```

## 二、自动更改

### 1.全局安装`react-native-rename`

```bish
npm i react-native-rename -g
```

### 2.到项目根目录执行：

```bish
react-native-rename "app" -b com.rn.app
```

### 3.然后参照手动更改部分，添加缺少部分