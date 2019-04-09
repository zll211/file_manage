export const scanRoute = [{
  path: 'scan',
  component: () => import(/* webpackChunkName: "system-scan" */ './scan'),
  name: '扫描仪管理',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  icon: 'assets/img/menu/scan.png',
}];
