import Vue from "vue";
import VueRouter from "vue-router";
import { authGuard } from "./guards/auth";
import LoginView from "../views/LoginView.vue";
import UserRegisterView from "../views/UserRegisterView.vue";
import DashboardView from "../views/DashboardView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/cadastrar',
    name: 'userRegister',
    component: UserRegisterView
  },
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  }
];

const router = new VueRouter({
  mode: 'history',
  routes: routes,
});

router.beforeEach(authGuard);

export default router;
