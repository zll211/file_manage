export const originRoute = [{
  path: 'origin',
  component: () => import(/* webpackChunkName: "system-origin" */ './origin'),
  name: '来源配置',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  icon: 'assets/img/menu/origin.png',
}];
