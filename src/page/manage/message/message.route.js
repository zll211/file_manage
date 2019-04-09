export const messageRoute = [{
  path: '/message/:id',
  props: true,
  component: () => import(/* webpackChunkName: "diagnosis-operate" */ './message'),
  name: '诊断',
  isShow:true,
  beforeEnter: (to, from, next) => {
    next();
  },
}];
