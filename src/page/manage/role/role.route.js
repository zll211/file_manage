export const roleRoute = [{
  path: '/role',
  component: () => import(/* webpackChunkName: "role" */ './role'),
  name: '角色管理',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  icon: 'assets/img/menu/role.png',
}];
