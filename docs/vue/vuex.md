# 实现一个极简易的Vuex核心功能

### 实现的方法分析

1. 作为插件一定有 `install` 方法，可以在其中进行 `mixin` ，当 `Vue实例化` 后挂载前拿到给其配置的store实例，把 `store` 挂载到原型上，以便全局可用；
2. 持有基本的 `state` 、保存实例化router时配置的 `mutations` 、 `actions` 对象；
3. 实现 `commit` 及 `dispatch` 等方法。

### 主代码块

``` js
let Vue;

class Store {
  constructor({
    state = {},
    mutations = Object.create(null),
    actions = Object.create(null)
  }) {

    // 利用data的双向绑定实现“响应化”
    this.state = new Vue({
      data: state
    });
    this.mutations = mutations;
    this.actions = actions;
    // 绑定this
    this.commit = this.commit.bind(this);
    this.dispatch = this.dispatch.bind(this);
  }

  commit(_type, _payload) {
    this.mutations[_type](this.state, _payload);
  }

  dispatch(_type, _payload) {
    return this.actions[_type](this, _payload);
  }
}

function install(_Vue) {
  // 避免重复安装
  if (!Vue) {
    Vue = _Vue;
    Vue.mixin({
      beforeCreate() {
        // 存在store其实代表的就是root节点
        if (this.$options.store) {
          this.$store = this.$options.store;
        } else if (this.$options.parent && this.$options.parent.$store) {
          // 子组件直接从父组件中获取$store，确保组件都公用了全局的同一份store
          this.$store = this.$options.parent.$store;
        }
      }
    });
  }
}

let Vuex = {
  Store,
  install
}

export default Vuex;
```
