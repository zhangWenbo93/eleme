// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import axios from "axios";
import Velocity from "velocity-animate";
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

import "common/index.styl";
/* eslint-disable no-new */
// 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
new Vue({
  router,
  render: h => h(App),
  data: {
    drop: new Vue() //通过单独的事件中心管理组件间的通信,此处处理cartcontrol子组件向父组件goods以及shopcart兄弟组件之间的通信
    //通过使用事件中心，允许组件自由交流，无论组件处于组件树的哪一层。由于 Vue 实例实现了一个事件分发接口，你可以通过实例化一个空的 Vue 实例来实现这个目的。
  }
}).$mount("#app");
