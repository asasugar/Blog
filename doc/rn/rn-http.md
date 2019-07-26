# 让rn支持http请求 😆

## 开发版支持http，但是打包版在android 9 以上 和 ios 9以上对http请求做了限制



### 一、Android端修改android/app/src/main/AndroidManifest.xml

```xml
<application
      ...
      android:usesCleartextTraffic="true">
</application>
```


### 二、iOS端修改info.plist
引入了新特性App Transport Security (ATS)，新特性要求App内访问的网络必须使用HTTPS协议

```plist
<key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <true/>
        <key>NSExceptionDomains</key>
        <dict>
            <key>localhost</key>
            <dict>
                <key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
                <true/>
            </dict>
        </dict>
    </dict>
```

