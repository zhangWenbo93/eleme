import Vue from "vue";
import Router from "vue-router";
import goods from "@components/goods/goods";
import ratings from "@components/ratings/ratings";
import seller from "@components/seller/seller";

Vue.use(Router);

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
//方法一
const routes = [
  {
    path: "/",
    redirect: "/goods"
  },
  {
    path: "/goods",
    component: goods
  },
  {
    path: "/ratings",
    component: ratings
  },
  {
    path: "/seller",
    component: seller
  }
];

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new Router({
  routes: routes, // （缩写）相当于 routes: routes
  linkExactActiveClass: "active" //激活的默认的 class
});

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
// const app = new Vue({
//   router
// }).$mount("#app");

// export default router; //抛出router

//方法二
export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/goods"
    },
    {
      path: "/goods",
      component: goods
    },
    {
      path: "/ratings",
      component: ratings
    },
    {
      path: "/seller",
      component: seller
    }
  ],
  linkExactActiveClass: "active"
});
