# rn修改应用版本号

## 一般情况下修改版本号需要去分别设置Android端和ios端，但是我们可以通过设置package.json的版本，然后来读取其值

### 一、Android端设置

#### 1、在 `android/app/build.gradle` :

```gradle
import java.io.File;
import groovy.json.JsonSlurper 

def getAppVersion() {
    def inputFile = new File("../package.json")
    def packageJson = new JsonSlurper().parseText(inputFile.text)
    return packageJson["version"]
}
 
def appVersion = getAppVersion()

...

defaultConfig {
    ...
    versionName appVersion
}
```

### 二、Ios端设置

#### 1、找到:`PROJECT_NAME=>TARGETS->Build Phases`->添加`Run Script`

![20191204143700.png](https://i.loli.net/2019/12/04/fO2iP5jVFAcmlgh.png)
替换

#### 2、插入bash

```bash
PACKAGE_VERSION=$(cat ../package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')

/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $PACKAGE_VERSION" "${PROJECT_DIR}/${INFOPLIST_FILE}"
```
