export const statisticsRoute = [{
  path: '/statistics',
  component: () => import(/* webpackChunkName: "entry" */ './statistics'),
  name: '数据统计',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  icon: 'assets/img/menu/statistics.png',
}];
