
export const operateRoute = [{
  path: 'operate',
  component: () => import(/* webpackChunkName: "log-operate" */ './operate'),
  name: '操作日志',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  icon: 'assets/img/menu/operate.png',
}];
