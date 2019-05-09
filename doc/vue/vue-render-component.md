# 如何编写 Vue render 组件？ 😆

## 为什么？

答：提供更强大的编程与流程控制能力，卸载组件重置状态、删除 DOM、移除事件监听...

### 主要结构

```js
src
│  └─components
│       └─CustomModal
│             └─index.js
│             └─Render.vue
│             └─Template.vue
```

### index.js

```js
import template from "./template.vue";
const CustomModalConstructor = Vue.extend(template);
const CustomModal = async ({
  render,
  onOk = () => {},
  onCancel = () => {},
  title = "标题",
  localeCancelText = "取消",
  localeOkText = "确定",
  showHead = true,
  footerHide = false
}) => {
  let vm = new CustomModalConstructor({
    created() {
      this.title = title;
      this.localeCancelText = localeCancelText;
      this.localeOkText = localeOkText;
      this.showHead = showHead;
      this.footerHide = footerHide;
      this.render = render;
      this.$on("on-ok", onOk);
      this.$on("on-cancel", onCancel);
    },
    methods: {}
  });
  vm.$mount();
  document.body.appendChild(vm.$el);
  return vm;
};
export default CustomModal;
```

### render.vue

```html
<script>
  export default {
    name: "Render",
    props: {
      render: {
        type: Function,
        default: () => {}
      }
    },
    render() {
      return this.render();
    }
  };
</script>
```

### template.vue

```html
<template>
  <div v-show="visible">
    <transition name="fade" mode="out-in">
      <div class="mongolian-layer">
        <div class="layer">
          <div v-if="showHead" class="title">
            <div class="title-text">{{ title }}</div>
            <a class="title-close" @click="cancel">
              <slot name="close">
                <Icon type="ios-close"></Icon>
              </slot>
            </a>
          </div>
          <div class="body">
            <Render :render="render" />
          </div>
          <div v-if="!footerHide" class="footer">
            <i-button type="text" size="large" @click.native="cancel"
              >{{ localeCancelText }}</i-button
            >
            <i-button type="primary" size="large" @click.native="ok"
              >{{ localeOkText }}</i-button
            >
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import Render from "./Render";
  export default {
    components: {
      Render
    },
    props: {
      title: String,
      localeCancelText: String,
      localeOkText: String,
      showHead: {
        type: Boolean,
        default: true
      },
      footerHide: {
        type: Boolean,
        default: false
      },
      render: Function
    },
    data() {
      return {
        visible: true
      };
    },
    methods: {
      /**
       * @description: 关闭弹窗移除dom、解绑事件
       * @param {type}
       * @return:
       */
      destroyed() {
        this.visible = false;
        this.$el.remove();
        this.$destroy();
      },
      ok() {
        this.destroyed();
        this.$emit("on-ok");
      },
      cancel() {
        this.destroyed();
        this.$emit("on-cancel");
      }
    }
  };
</script>
<style lang="less" scoped>
  .mongolian-layer {
    position: fixed;
    overflow: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    background-color: rgba(55, 55, 55, 0.6);
    height: 100%;
    -webkit-overflow-scrolling: touch;
    outline: 0;
    text-align: center;
    .layer {
      min-width: 520px;
      display: inline-block;
      margin: 0 auto;
      position: relative;
      outline: 0;
      top: 100px;
      background-color: @WHITE;
      text-align: left;
      border: 0;
      border-radius: 6px;
      background-clip: padding-box;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      .title {
        border-bottom: 1px solid #e8eaec;
        padding: 14px 16px;
        line-height: 1;
        .title-text {
          display: inline-block;
          width: 100%;
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          color: #17233d;
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .title-close {
          z-index: 1;
          font-size: 12px;
          position: absolute;
          right: 8px;
          top: 8px;
          overflow: hidden;
          cursor: pointer;
          .ivu-icon-ios-close {
            font-size: 31px;
            color: #999;
            transition: color 0.2s ease;
            position: relative;
            top: 1px;
          }
        }
      }
      .body {
        padding: 16px;
        font-size: 12px;
        line-height: 1.5;
      }
      .footer {
        border-top: 1px solid #e8eaec;
        padding: 12px 18px;
        text-align: right;
      }
    }
  }
</style>
```

### 发布 npm

```js
npm login
// 输入npm账号，密码

npm publish
// 发布插件前会执行`republish`命令，完成打包压缩
```
