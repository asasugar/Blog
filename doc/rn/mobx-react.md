# 如何使用 mobx-react 做rn状态管理？ 😆

## 1、安装 `mobx-react`、`mobx`，重点：控制为同一个大版本

```bish
yarn add mobx mobx-react
```
![20190725205246.png](https://i.loli.net/2019/07/25/5d39a62498c9b35750.png)

## 2、安装 babel 支持装饰器@ `@babel/plugin-proposal-decorators`，控制为同一个大版本

```bish
yarn add @babel/core @babel/runtime @babel/plugin-proposal-decorators -D
```
![20190725205654.png](https://i.loli.net/2019/07/25/5d39a718aafe228583.png)

## 3、babel7以下配置.babelrc文件，babel7以上配置babel.config.js

```js
module.exports = {
  ...
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ],
    ...
  ]
};

```

## 4、使用方法

- 创建 `store` 文件夹，如图：![20190725210208.png](https://i.loli.net/2019/07/25/5d39a8523b02b51075.png)

- 编写src/store/index.js

```js
import Global from './modules/Global';
/**
 * 根store
 * @class RootStore
 * Global 全局
 */
class RootStore {
  constructor() {
    this.Global = new Global();
  }
}

// 返回RootStore实例
export default new RootStore();

```
- 编写src/store/modules/Global.js

```js
import { observable, action} from 'mobx';

export default class Global {

  @observable userName = '123';

  @action
  setUserName(userName) {
    this.userName = userName;
  }
}

```

- 在App.js中通过 `Provider` 组件挂载 rootStore 

```js
import React from 'react';
import { Provider } from 'mobx-react';
import AppContainer from './src/router';
// 获取mobx-store实例
import store from './src/store';

// eslint-disable-next-line react/display-name
export default () => (
  <Provider rootStore={store}>
    <AppContainer />
  </Provider>
);

```

- 在组件中的使用

```js
import { observer, inject } from 'mobx-react';
@inject('rootStore')
@observer
class Cate extends Component {
  ...
  componentDidMount = () => {
    const {rootStore} = this.props;
    console.log(rootStore.Global.userName); // 123
  }
  ...
}
```

***

## 附上基于3.11.0版本 `react-navigation` 路由配置

```js
import React from 'react';
import { Image, TouchableOpacity, Text } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer
} from 'react-navigation';

import { StackViewStyleInterpolator } from 'react-navigation-stack';
import pxToDp from '@/utils/pxToDp';
import { CONST } from '@/utils/css/common';
import TabBarItem from '../components/tabBarItem';

import Home from '../pages/Home';
import Source from '../pages/Source';
import B2C from '../pages/B2C';
import Cart from '../pages/Cart';
import MyCenter from '../pages/MyCenter';

import Login from '../pages/Login';
import Welcome from '../pages/Welcome';
import Detail from '../pages/Detail';
import HomeScreen from '../pages/Home/page';
import MyCenterScreen from '../pages/MyCenter/page';

const routeOptMap = {
  Home: {
    selectedImage: require('../assets/img/tab/home_active.png'),
    normalImage: require('../assets/img/tab/home.png'),
    tabBarLabel: '首页'
  },
  Source: {
    selectedImage: require('../assets/img/tab/source_active.png'),
    normalImage: require('../assets/img/tab/source.png'),
    tabBarLabel: '货源'
  },
  B2C: {
    selectedImage: require('../assets/img/tab/shop_active.png'),
    normalImage: require('../assets/img/tab/shop.png'),
    tabBarLabel: 'B2C'
  },
  Cart: {
    headerTitle: '进货单',
    selectedImage: require('../assets/img/tab/cart_active.png'),
    normalImage: require('../assets/img/tab/cart.png'),
    tabBarLabel: '进货单'
  },
  MyCenter: {
    selectedImage: require('../assets/img/tab/me_active.png'),
    normalImage: require('../assets/img/tab/me.png'),
    tabBarLabel: '我的'
  },
  ...HomeScreen,
  ...MyCenterScreen
};
// 底部路由
const TabNavigator = createBottomTabNavigator(
  {
    Home,
    Source,
    B2C,
    Cart,
    MyCenter
  },
  {
    // tabBar配置统一在这里配置
    // 不需要到每个页面中进行配置了
    defaultNavigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state;
      return {
        tabBarLabel: routeOptMap[routeName].tabBarLabel,
        // eslint-disable-next-line react/display-name
        tabBarIcon: ({ focused, tintColor }) => (
          <TabBarItem
            focused={focused}
            normalImage={routeOptMap[routeName].normalImage}
            selectedImage={routeOptMap[routeName].selectedImage}
            tintColor={tintColor}
          />
        )
      };
    },
    tabBarOptions: {
      activeTintColor: CONST.RED,
      inactiveTintColor: '#979797',
      labelStyle: {
        fontSize: 12 // 文字大小
      }
    }
  },
);

// 默认header配置
const defaultHeaderOpts = {
  headerTitleStyle: {
    flex: 1, // 解决安卓机title不居中
    textAlign: 'center', // 解决安卓机title不居中
    fontSize: pxToDp(26),
    color: CONST.GRAY_333
  },
  headerStyle: {
    height: pxToDp(68),
    backgroundColor: CONST.WHITE
  }
};
const AppNavigator = createStackNavigator(
  {
    TabNavigator: { screen: TabNavigator },
    ...HomeScreen,
    ...MyCenterScreen,
    Welcome: { screen: Welcome },
    Login: { screen: Login },
    Detail: { screen: Detail }
  },
  {
    initialRouteName: 'Login', // 默认打开页面
    // headerMode: 'none',
    mode: 'card',
    defaultNavigationOptions: ({ navigation }) => {
      const { routeName, routes, index } = navigation.state;

      let config = {
        ...defaultHeaderOpts,
        gesturesEnabled: true,
        headerBackTitle: null,
        headerTitle:
          routes ? routeOptMap[routes[index].routeName].headerTitle : routeOptMap[routeName] && routeOptMap[routeName].headerTitle
      };
      if (routes) {
        // 底部导航栏部分
        // 没有headerTitle属性时，隐藏标题
        if (!routeOptMap[routes[index].routeName].headerTitle) {
          Object.assign(config, { header: null });
        }
        // 设置标题左边部分
        if (routeOptMap[routes[index].routeName].isShowHeaderLeft) {
          Object.assign(config, {
            headerLeft: routeOptMap[routes[index].routeName].headerLeft || (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ width: pxToDp(100), height: '100%', justifyContent: 'center', alignItems: 'center' }}
              >
                <Image
                  source={require('../assets/img/arrow-left.png')}
                  style={{ width: pxToDp(30), height: pxToDp(30) }}
                />
              </TouchableOpacity>
            )
          });
        }
        // 设置标题右边部分
        if (routeOptMap[routes[index].routeName].isShowHeaderRight) {
          Object.assign(config, { headerRight: routeOptMap[routes[index].routeName].headerRight || <Text></Text> });
        }
      } else {
        // 其他页面
        if (routeOptMap[routeName] && !routeOptMap[routeName].headerTitle) {
          Object.assign(config, { header: null });
        }
        if (routeOptMap[routeName] && routeOptMap[routeName].isShowHeaderLeft) {
          Object.assign(config, {
            headerLeft: routeOptMap[routeName].headerLeft || (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ width: pxToDp(100), height: '100%', justifyContent: 'center', alignItems: 'center' }}
              >
                <Image
                  source={require('../assets/img/arrow-left.png')}
                  style={{ width: pxToDp(40), height: pxToDp(40) }}
                />
              </TouchableOpacity>
            )
          });
        }
        if (routeOptMap[routeName] && routeOptMap[routeName].isShowHeaderRight) {
          Object.assign(config, { headerRight: routeOptMap[routeName].headerRight || <Text></Text> });
        }
      }

      return config;
    },
    transitionConfig: () => ({
      // 统一安卓和苹果页面跳转的动画
      screenInterpolator: StackViewStyleInterpolator.forHorizontal
    })
  },
);
const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;

```
