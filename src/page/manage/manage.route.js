import {routerHelperProvider} from '../../router';
import {sliceRoute} from "./slice/slice.route";
import {entryRoute} from "./entry/entry.route";
import {roleRoute} from "./role/role.route";
import {userRoute} from "./user/user.route";
import {statisticsRoute} from "./statistics/statistics.route";
import {messageRoute} from "./message/message.route";
import {logRoute} from './log/log.route';
import {systemRoute} from './system/system.route';


export const manageRoute = [{
  path: '/manage',
  component: () => import(/* webpackChunkName: "manage" */ './manage'),
  name: 'manage',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/slice',
  children: [...sliceRoute, ...entryRoute, ...roleRoute, ...userRoute, ...statisticsRoute, ...messageRoute, ...logRoute, ...systemRoute],
}];

routerHelperProvider.configureRoutes(manageRoute);
