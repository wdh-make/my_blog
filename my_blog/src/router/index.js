import { createRouter, createWebHistory } from 'vue-router'
import { getItem } from "@/assets/js/utils";

import Home from '../views/Home.vue'
import store from "../store/index";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: "",
        redirect: "home",
      },
      {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "about" */ '../views/HomeView')
      },
      {
        path: '/blog',
        name: 'blog',
        component: () => import(/* webpackChunkName: "about" */ '../views/BlogView')
      },
      {
        path: '/sort',
        name: 'sort',
        component: () => import(/* webpackChunkName: "about" */ '../views/SortView')
      },
      {
        path: '/about',
        name: 'about',
        component: () => import(/* webpackChunkName: "about" */ '../views/AboutView')
      }
    ]
  },
  {
    path: '/detail',
    name: 'Detail',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/DetailView')
  },
  {
    path: '/edit',
    name: 'Edit',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/EditView')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {
  // console.log(to, 'router');
  // if (to.meta.requiresAuth !== false) {
  //   var url = window.location.href; //获取当前url
  //   // var dz_url = url.split("#")[0]; //获取#/之前的字符串
  //   var cs = url.split("?")[1]; //获取?之后的参数字符串
  //   var cs_arr = cs ? cs.split("&") : []; //参数字符串分割为数组
  //   var ob = {};

  //   for (var i = 0; i < cs_arr.length; i++) {
  //     //遍历数组，拿到json对象

  //     ob[cs_arr[i].split("=")[0]] = cs_arr[i].split("=")[1];
  //   }
  //   let t = ob.token; //这样就拿到了参数中的数据
  //   if(t) {
  //     app.setItem("Authorization", t);
  //   }
    // let token = app.getItem("Authorization");
    // if (!token) {
    //   // next('/login');
    //   app.errMessage("Token已失效，请重新登入！！");
    //   store.commit("setRouteName", to);
    //   next();
    //   return;
    // } else {
      // store.commit("setRouteName", to);
      // next();
    // }
  // } else {
    let token = getItem('token')
    if(to.fullPath.includes("/edit") && !token) {
      next('/login');
      return;
    }

    store.commit('setToken', token)
    let userInfo = getItem('user')
    store.commit('setUserInfo', userInfo)
    store.commit("setRouteName", to);
    next();
  // }
});
export default router
