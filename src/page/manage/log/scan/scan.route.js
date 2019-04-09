
export const scanRoute = [{
  path: 'scan',
  component: () => import(/* webpackChunkName: "log-scan" */ './scan'),
  name: '扫描日志',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  icon: 'assets/img/menu/rabbit.png',
}];
