# rn安卓端多厂商推送交互

看本文前，请先集成多厂商推送！！！

## 为什么需要多厂商推送

由于国内，谷歌被Q,离线推送需要走厂商通道，目前市面上主流的厂商通道包括`oppo`、`vivo`、`小米`、`魅族`、`华为`，主流的第三方推送平台如极光、个推，需要集成多厂商的话，需要与它们的商务沟通，会发送文档集成，我们还需要到各厂商开通推送服务，获取相应的参数集成到第三方推送。集成的话一般按文档就能实现，但是多厂商的消息push的rn的js层需要我们自己处理，本文主要讲的是如何push厂商消息

## MainActivity.java

- 以极光为例，
```java
...
import android.app.Activity;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.content.Intent;
import org.json.JSONException;
import org.json.JSONObject;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import javax.annotation.Nullable;
import com.facebook.react.ReactInstanceManager;

public class MainActivity extends ReactActivity {
    ReactInstanceManager reactInstanceManager;

    private static final String TAG = "OpenClickActivity";
    /** 消息Id **/
    private static final String KEY_MSGID = "msg_id";
    /** 该通知的下发通道 **/
    private static final String KEY_WHICH_PUSH_SDK = "rom_type";
    /** 通知标题 **/
    private static final String KEY_TITLE = "n_title";
    /** 通知内容 **/
    private static final String KEY_CONTENT = "n_content";
    /** 通知附加字段 **/
    private static final String KEY_EXTRAS = "n_extras";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handleOpenClick();
    }

    private void sendEvent(ReactContext reactContext, String eventName, String params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    /**
     * 处理点击事件，当前启动配置的Activity都是使用 Intent.FLAG_ACTIVITY_CLEAR_TOP |
     * Intent.FLAG_ACTIVITY_NEW_TASK 方式启动，只需要在onCreat中调用此方法进行处理
     */
    private void handleOpenClick() {
        Log.d(TAG, "用户点击打开了通知");
        String data = null;
        // 获取华为平台附带的jpush信息
        if (getIntent().getData() != null) {
            data = getIntent().getData().toString();
        }
        // 获取fcm、oppo平台附带的jpush信息
        if (TextUtils.isEmpty(data) && getIntent().getExtras() != null) {
            data = getIntent().getExtras().getString("JMessageExtra");
        }

        ReactContext reactContext = getReactInstanceManager().getCurrentReactContext();

        if (TextUtils.isEmpty(data))
            return;
        try {
            ReactInstanceManager reactInstanceManager = getReactNativeHost().getReactInstanceManager();
            if (reactContext != null) {
                sendEvent(reactContext, "jpushMsg", String.valueOf(data));
            } else {
                reactInstanceManager
                        .addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
                            ReactContext reactContext = getReactInstanceManager().getCurrentReactContext();

                            @Override
                            public void onReactContextInitialized(ReactContext reactContext) {
                                reactContext.runOnNativeModulesQueueThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        String data = null;
                                        // 获取华为平台附带的jpush信息
                                        if (getIntent().getData() != null) {
                                            data = getIntent().getData().toString();
                                        }
                                        // 获取fcm、oppo平台附带的jpush信息
                                        if (TextUtils.isEmpty(data) && getIntent().getExtras() != null) {
                                            data = getIntent().getExtras().getString("JMessageExtra");
                                        }
                                        if (TextUtils.isEmpty(data))
                                            return;
                                        sendEvent(reactContext, "jpushMsg", String.valueOf(data));
                                    }
                                });
                                reactInstanceManager.removeReactInstanceEventListener(this);

                            }
                        });
            }

            JSONObject jsonObject = new JSONObject(data);
            String msgId = jsonObject.optString(KEY_MSGID);
            byte whichPushSDK = (byte) jsonObject.optInt(KEY_WHICH_PUSH_SDK);
            String title = jsonObject.optString(KEY_TITLE);
            String content = jsonObject.optString(KEY_CONTENT);
            String extras = jsonObject.optString(KEY_EXTRAS);
            StringBuilder sb = new StringBuilder();
            sb.append("msgId:");
            sb.append(String.valueOf(msgId));
            sb.append("\n");
            sb.append("title:");
            sb.append(String.valueOf(title));
            sb.append("\n");
            sb.append("content:");
            sb.append(String.valueOf(content));
            sb.append("\n");
            sb.append("extras:");
            sb.append(String.valueOf(extras));
            sb.append("\n");
            sb.append("platform:");
            sb.append(getPushSDKName(whichPushSDK));
        } catch (JSONException e) {
            Log.w(TAG, "parse notification error");
        }

    }

    private String getPushSDKName(byte whichPushSDK) {
        String name;
        switch (whichPushSDK) {
        case 0:
            name = "jpush";
            break;
        case 1:
            name = "xiaomi";
            break;
        case 2:
            name = "huawei";
            break;
        case 3:
            name = "meizu";
            break;
        case 4:
            name = "oppo";
            break;
        case 5:
            name = "vivo";
            break;
        case 8:
            name = "fcm";
            break;
        default:
            name = "jpush";
        }
        return name;
    }

    // singleTask模式可调用
    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleOpenClick();
        Log.d(TAG, "onNewIntent ~~~~~~~ intent = ");
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is
     * used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "rnApp";
    }

}
```

- 设置 launchMode 为 `singleTask`

```xml
// AndroidManifest.xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="com.seatent.haidaiApp" xmlns:tools="http://schemas.android.com/tools">
    ...
    <application
      android:usesCleartextTraffic="true"
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false"
      tools:replace="android:allowBackup"
      android:theme="@style/AppTheme">
     <activity
        android:launchMode="singleTask"
        android:name="com.seatent.haidaiApp.MainActivity"
        android:resizeableActivity="true"
        android:label="@string/app_name"
        android:screenOrientation="portrait"
        android:configChanges="keyboard|keyboardHidden|orientation|screenSize"
        android:windowSoftInputMode="adjustResize">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
            <action android:name="android.intent.action.DOWNLOAD_COMPLETE"/>
        </intent-filter>
      </activity>
      ...
    </application>
</manifest>
```
在这个模式下，如果栈中存在这个Activity的实例就会复用这个Activity，不管它是否位于栈顶，复用时，会将它上面的Activity全部出栈，因为singleTask本身自带clearTop这种功能。并且会回调该实例的onNewIntent()方法。

## rn端接收回调

```js
import { DeviceEventEmitter } from 'react-native';
import JPush from 'jpush-react-native';
...{
    componentWillMount(){
        this.getJPushMsg();
    }
    getJPushMsg = () => {
        JPush.init();

        // IOS通知回调
        this.notificationListener = result => {
            if (isIOS()) {
                // 打开对应落地页
                setTimeout(() => {
                    // 获取参数进行操作
                });
            }
        };
        JPush.addNotificationListener(this.notificationListener);

        // android厂商推送发送通知的回调
        this.jpushMsg = DeviceEventEmitter.addListener('jpushMsg', result => {
            // 返回的是string，需要做转化
            try {
                let r = JSON.parse(result);
                if (r && r.n_extras) {
                    this.pushTimer = setTimeout(() => {
                        // 获取参数进行操作
                    }, 1000);
                }
            } catch (error) {
                return false;
            }
        });
    }
}
```
