import store from '../../store'

export function authGuard(to, _, next) {
  if (to.meta.requiresAuth && !store.getters['auth/isAuth']) {
    return next({name: 'login'});
  }

  next();
}