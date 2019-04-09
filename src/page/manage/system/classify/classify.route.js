export const classifyRoute = [{
  path: 'classify',
  component: () => import(/* webpackChunkName: "system-classify" */ './classify'),
  name: '分类管理',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  icon: 'assets/img/menu/classify.png',
}];
