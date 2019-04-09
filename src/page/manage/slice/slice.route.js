export const sliceRoute = [{
  path: '/slice',
  component: () => import(/* webpackChunkName: "slice" */ './slice'),
  name: '数据列表',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  icon: 'assets/img/menu/slice.png',
}];
