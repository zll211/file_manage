
import {scanRoute} from "./scan/scan.route";
import {classifyRoute} from "./classify/classify.route";
import {originRoute} from "./origin/origin.route";


export const systemRoute = [{
  path: '/system',
  component: () => import(/* webpackChunkName: "system" */ './system'),
  name: '系统管理',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [...scanRoute, ...classifyRoute, ...originRoute],
  icon: 'assets/img/menu/system.png',
}];
