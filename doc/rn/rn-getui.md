# 为rn集成个推 😆

## 基于[react-native-getui]()

### 一、安装

```bish
yarn add react-native-getui
```

```bish
react-native link
```

package.json添加script命令`GetuiConfigure`

```json
"scripts":{
    ...
    "GetuiConfigure": "node node_modules/react-native-getui/GetuiConfiguration.js",
    ...
}
```

```bish
yarn GetuiConfigure  <yourAppId> <yourAppKey> <yourAppSecret>  <yourModuleName>
// yourModuleName 指的是你的 Android 项目中的模块名称（对 iOS 没有影响，不填写的话默认值为 app）
// 举个列子：
npm run GetuiConfigure DI1jwW3FtZ6kGDeY5dk0Y9 DQCk2V8Jev9hqhWDU94PF9 Rtyp5trKUt8HSyzD8zRXX7 app

```
### 二、Android
android/app/src/main/java/com/xx/MainActivity.java

```java
import android.os.Bundle;
import com.getui.reactnativegetui.GetuiModule;

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        GetuiModule.initPush(this);
    }
    ...
}
```

### 三、Ios
1. 在 iOS 工程中如果找不到头文件可能要在 BUILD SETTINGS -> Search Paths -> Header Search Paths 添加如下如路径：

```js
$(SRCROOT)/../node_modules/react-native-getui/ios/RCTGetuiModule
```

2. BUILD PHASES -> Link Binary With Libraries 添加 bibresolv.tbd 依赖库

![20190819194046.png](https://i.loli.net/2019/08/19/mD9WLNb3xRh27et.png)

### 四、使用
```js
import Getui from 'react-native-getui';

// 订阅消息通知

NativeAppEventEmitter.addListener(
  'receiveRemoteNotification',
  (notification) => {
    // Android的消息类型为payload 透传消息 或者 cmd消息
    switch (notification.type) {
      case 'cid':
        //  console.log("receiveRemoteNotification cid = " + notification.cid)
        Alert.alert('初始化获取到cid', JSON.stringify(notification));
        break;
      case 'payload':
        Alert.alert('payload 消息通知', JSON.stringify(notification));
        break;
      case 'cmd':
        Alert.alert('cmd 消息通知', 'cmd action = ' + notification.cmd);
        break;
      case 'notificationArrived':
        Alert.alert('notificationArrived 通知到达', JSON.stringify(notification));
        break;
      case 'notificationClicked':
        Alert.alert('notificationArrived 通知点击', JSON.stringify(notification));
        break;
      default:
    }
  }
);

NativeAppEventEmitter.addListener(
  'clickRemoteNotification',
  (notification) => {
    Alert.alert('点击通知', JSON.stringify(notification));
  }
);
```