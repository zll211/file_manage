export const entryRoute = [{
  path: '/entry',
  component: () => import(/* webpackChunkName: "entry" */ './entry'),
  name: '数据录入',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  icon: 'assets/img/menu/entry.png',
}];
