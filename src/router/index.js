import Vue from "vue";
import VueRouter from "vue-router";
import { authGuard } from "./guards/auth";
import Home from "../views/Home.vue";
import LoginView from "../views/Auth/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  }
];

// const routes = [
//   {
//     path: "/",
//     name: "Home",
//     component: Home,
//   },
//   {
//     path: "/about",
//     name: "About",
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () =>
//       import(/* webpackChunkName: "about" */ "../views/About.vue"),
//   },
// ];

const router = new VueRouter({
  mode: 'history',
  routes: routes,
});

router.beforeEach(authGuard);

export default router;

