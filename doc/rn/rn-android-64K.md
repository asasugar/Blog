# Android App 方法超出64K解决方案，即如何启动“多 dex 文件” 😆

## 当您的应用及其引用的库超过 65,536 种方法时，您会遇到一个编译错误，指明您的应用已达到 Android 编译架构规定的引用限制：



### 一、报错如下：
```bish
D8: Cannot fit requested classes in a single dex file (# methods: xxxxx > 65536)

trouble writing output:
Too many field references: 131000; max is 65536.
You may try using --multi-dex option.
```

较低版本的编译系统会报告一个不同的错误，但指示的是同一问题：
```bish
Conversion to Dalvik format failed:
Unable to execute dex: method ID not in [0, 0xffff]: 65536
```

### 二、解决方法

#### 1、在 `android/app/build.gradle`, 更新 `dependency` :

```gradle
defaultConfig {
    // ... your `applicationId`, etc.
    multiDexEnabled true
}

// ...
dependencies {
    // ... your other dependencies

    // Multidex
    implementation 'com.android.support:multidex:1.0.3'
}
```

#### 2、在 `MainApplication.java`

```java
import android.app.Application;
```
替换

```java
import android.support.multidex.MultiDexApplication;
```

如果 RN 0.60+ 或者支持 AndroidX :

```java
import androidx.multidex.MultiDexApplication;
```

#### 3、在 `MainApplication.java`
```java
public class MainApplication extends Application implements ReactApplication {
```
替换

```java
public class MainApplication extends MultiDexApplication implements ReactApplication {
```