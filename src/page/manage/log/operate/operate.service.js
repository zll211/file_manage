import Vue from 'vue';

import {baseUrl} from '@/config/utils';

/**
 * 日志模块的服务
 * @class
 */
class OperateService {
  /**
   * @constructor
   */
  constructor() {
  }

  /**
   * 登录日志列表接口
   * @return {Promise}
   */
  loginList(params) {
    return Vue.http.get(`${baseUrl}/auth_log`, {params: params});
  }

  /**
   * 操作日志列表接口
   * @return {Promise}
   */
  operateList(params) {
    return Vue.http.get(`${baseUrl}/opt_log`, {params: params});
  }


}

const operateService = new OperateService();

export {operateService};
