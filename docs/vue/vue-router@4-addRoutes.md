# 在vue-router@4以上的版本实现类似3版本的addRoutes

### 背景

vue-router@4 版本移除 `addRoutes`, 详见[guide](https://next.router.vuejs.org/guide/migration/index.html)

### 代码

- 动态导入组件

```ts
/**
 * @description 动态import
 * @param {string} component: /views/home/index.vue
 * @returns {*}
 */
export function dynamicImport(component: string) {
  const componentStr = component.replace(/^\/+/, ''), // 过滤字符串前面所有 '/' 字符
    componentPath = componentStr.replace(/\.\w+$/, ''); // 过滤掉后缀名，为了让 import 加入 .vue
  return () => import('../' + componentPath + '.vue');
}
```

- 遍历routes对象，单个addRoute

```ts
...
const addRoutes = (routes: IRoutes[], parentName = ''): void => {
  routes.forEach(item => {
    if (item.name && router.hasRoute(item.name)) return; // Do not re-add if a route with the specified name exists

    if (item.path && item.component) {
      const route = {
        path: item.path,
        redirect: item.redirect,
        name: item.name,
        component: dynamicImport(item.component),
        meta: item.meta
      };

      parentName ? router.addRoute(parentName, route) : router.addRoute(route);
      if (item.children && item.children.length) {
        addRoutes(item.children, item.name);
      }
    }
  });

  // Important: 添加404路由
  if (!router.hasRoute('NotFound')) {
    router.addRoute({
      name: 'NotFound',
      path: '/:pathMatch(.*)*',
      component: () => import('../views/error/error-404.vue')
    });
  }
};
...
```

- 动态路由注册（需要在合适的时间清空session/storage里存储的缓存，如：切换账号）

```ts
export const registerDynamicRoutes = async () => {
  const routerMap = getSession('routerMap');

  if (routerMap?.length) {
    addRoutes(routerMap);
    return true;
  } else {
    // 模拟后端接口请求
    const routes = await systemService.getRoute();
    setSession('routerMap', routes);
    addRoutes(routes);
    return true;
  }
};
```

- main.{j,t}s 文件注册路由

```ts
import router from '@/router'; // 静态路由
import { registerDynamicRoutes } from '@/router/dynamic'; // 动态路由
registerDynamicRoutes(); // 确保初始化，刷新时路由正常
const app = createApp(App); 
app.use(router).use(store).mount('#app');
```

详细示例见[vite-element-plus-admin](https://github.com/asasugar/vite-element-plus-admin)项目