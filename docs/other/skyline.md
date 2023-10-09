# 小程序skyline渲染引擎迁移

## 环境准备

Skyline 具体支持版本如下：

- 微信安卓客户端 8.0.33 或以上版本（对应基础库为 2.30.4 或以上版本）
- 微信 iOS 客户端 8.0.34 或以上版本（对应基础库为 2.31.1 或以上版本）
- 开发者工具 Stable 1.06.2307260 或以上版本（建议使用 Nightly 最新版）

扫码快速确认环境是否正确

![20231009182823](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20231009182823.png)

## 快捷切换入口
![20231009182912](https://raw.githubusercontent.com/asasugar/pic-bed/master/imgs/20231009182912.png)

## 实践中发现的问题


1. 布局采用导航栏+滚动区域的形式（即nav+scroll-view）
   - 场景一：scroll-view未指定高度，而是通过设置flex:1 自适应撑开页面容器，如果最外层的page没有设置flex布局，就会导致页面空白；

   - 场景二：scroll-view手动设置了高度，如果最外层page设置了flex，则需要强制设置flex-direction: column ,否则会空白，最外层不设置flex显示正常，但是滚动区域高度不符合预期

    坑点：正常web中这两种场景，影响的只是页面的高度，而skyline中直接显示空白，问题难以排查

2. 若未指定defaultDisplayBlock: true 则flex-direction默认值column，与web预期不同（row）,项目中横向布局的需要手动指定flex-direction: row适配

3. 组件中使用了addGlobalClass: true则，配置到 *.json文件 "styleIsolation": "apply-shared" 兼容

4. 使用skyline的页面，强制需要设置自定义导航栏

5. 如果在skyline中使用create.js（omi库），绑定的事件使用了worklet，开发者工具必奔溃

6. worklet方法中输出this会报错,调用非worklet函数需要使用runOnJS

    ```js
    async refresh() {
        await ajax(...);
    },
    someWorklet(e) {
        'worklet';
        runOnJS(this.refresh)();
    },
    ```
7. worklet动画系统的applyAnimatedStyle方法，如果标签是动态判断（即使用了wx:if），直接在onLoad或者onReady调用applyAnimatedStyle会报错，因为这时候标签不存在。

   需要在异步赋值之后去调用applyAnimatedStyle

   ```js
    async getSomeAjaxData() {
        const content = await ajax(...);       
      this.applyAnimatedStyle('#id', ()=>{});
    }
   ```
## 我是如何渐进式切换skyline框架？

1. app.json文件需要配置两个参数： 
    ```js
    // app.json
    {
      "lazyCodeLoading": "requiredComponents",
      "rendererOptions": {
        "skyline": {
          "defaultDisplayBlock": true 
        }
      }
    }
    ```
2. 需要skyline改造的页面page.json文件配置：
    ```js
    // page.json
    {
      "disableScroll": true,
      "renderer": "skyline", // 必填
      "navigationStyle": "custom", // 必填
      "componentFramework": "glass-easel", // 必填
      "pureDataPattern": "^_"
    }
    ```    
    说明：需要页面级的滚动事件监听则disableScroll需要改为true；renderer表示页面通过后端框架渲染skyline或者webview；必须使用自定义导航栏，因为目前skyline默认不支持系统导航栏；组件框架需指定glass-easel或者exparser ;pureDataPattern来指定纯数据字段（非渲染数据），详见https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/pure-data.html

3. skyline下Page.onPageScroll不支持，布局推荐scroll-view的局部滚动事件。一般来说，界面布局大多数都是导航栏 + 滚动区域的形式，提供一种常规做法（兼容 WebView）
    ```html
    <!-- wxml -->
    <view class="flex column">
      <navigation-bar></navigation-bar>
      <!-- 通过使用 flex 布局，将 scroll-view 设置 flex:1 以占据页面剩余空间 -->
      <scroll-view type="list" scroll-y class="flex flex__item scroll--hidden" bindscroll="handleScrollWithWebview" worklet:onscrollupdate="handleScrollWithSkyline">
          <view wx:for="{{items}}" list-item></view>
      </scroll-view>
    </view>
    ```  
    为了同时兼容skyline和webview渲染，需要同时bindscroll、worklet:onscrollupdate，skyline中通过worklet增强特性去完成后续逻辑。
4. skyline下长列表性能优化
  
    Skyline 下的 scroll-view 组件自带按需渲染的优化，这在很大程度上提升了长列表的渲染性能，这里是以 scroll-view 的直接子节点为粒度来按需渲染的，当其某个子节点接近 scroll-view 的 viewport 时就会被渲染，反之则会回收。
    
    ```html
    <!-- wxml -->
    <!-- 以下 scroll-view 的直接子节点有 5 个 view，此时每个 view 都能按需渲染 -->
    <scroll-view type="list" scroll-y>
        <view> a </view>
        <view> b </view>
        <view> c </view>
        <view> d </view>
        <view> e </view>
    </scroll-view>
    <!-- 以下 scroll-view 的直接子节点只有 1 个 view，按需渲染并不能发挥作用 -->
    <scroll-view type="list" scroll-y>
        <view>
            <view> a </view>
            <view> b </view>
            <view> c </view>
            <view> d </view>
            <view> e </view>
        </view>
    </scroll-view>
    ```  
    所以在实践中如果scroll-view中是嵌套遍历内容子节点的话，我们可以使用block去代替外层的view。
此外，长列表的每一项的样式基本是一样的，Skyline 也支持了相似节点的样式共享，使得样式只需要计算一次便能共享给其它相似节点，大大提升了样式计算的性能。一般来说，我们会用 WXML 模板语法 wx:for 来展开列表，因此只需要在列表项声明 list-item 就能启动样式共享（后续版本会识别 wx:for 而自动启用）
    ```html
    <!-- wxml -->
    <scroll-view type="list" scroll-y>
      <view wx:for="" list-item wx:key="index"> {{index}} </view>
    </scroll-view>
    ``` 
## Skyline增强特性

1. worklet 动画机制

    小程序采用双线程架构，渲染线程（UI 线程）和逻辑线程（JS 线程）分离。JS 线程不会影响 UI 线程的动画表现，如滚动效果。但引入的问题是，UI 线程的事件发生后，需跨线程传递到 JS 线程，进而触发开发者回调，当做交互动画（如拖动元素）时，这种异步性会带来较大的延迟和不稳定。

    worklet 动画正是为解决这类问题而诞生的，使得小程序可以做到类原生动画般的体验

    ```js
      setAni(detail) {
        'worklet';
        if (detail.scrollTop > 0 && this._shareImg.value) {
          if (detail.deltaY < 20) {
            this._opacity.value = 1;
            this._offset.value = timing(0, {
              duration: 550,
              easing: Easing.cubicBezier(0.25, 0.1, 0.25, 1)
            });
          } else {
            this._opacity.value = 0.3;
            this._offset.value = timing(280, {
              duration: 550,
              easing: Easing.cubicBezier(0.25, 0.1, 0.25, 1)
            });
          }
        }
      },
      handleScrollWithSkyline(e) {
        'worklet';
        const { detail } = e;
        this.setAni(detail);
        runOnJS(this.handleVisualList)(detail.scrollTop);
      },
    ```

    总结：'worklet' 标识符代表这是一个worklet增强函数，后续的代码都是执行在UI线程，如果需要使用到非sharedValue定义的数据（如：this.data.xx）则会直接报错，需要运行在JS线程中，即使用runOnJS。个人经验总结：非渲染相关的逻辑统统在UI线程中去完成，如果需要使用到setData或者ajax之后的数据，可以在onLoad中去定义一个sharedValue，然后去赋值。