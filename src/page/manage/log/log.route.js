import {operateRoute} from "./operate/operate.route";
import {scanRoute} from "./scan/scan.route";

export const logRoute = [{
  path: '/log',
  component: () => import(/* webpackChunkName: "log" */ './log'),
  name: '系统日志',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [...operateRoute, ...scanRoute],
  icon: 'assets/img/menu/log.png',
}];
