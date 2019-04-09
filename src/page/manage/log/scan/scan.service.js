import Vue from 'vue';

import {baseUrl} from '@/config/utils';

/**
 * 日志模块的服务
 * @class
 */
class ScanService {
  /**
   * @constructor
   */
  constructor() {
  }

  /**
   * 扫描日志列表接口
   * @return {Promise}
   */
  scanList(params) {
    return Vue.http.get(`${baseUrl}/slice_log`, {params: params});
  }

}

const scanService = new ScanService();

export {scanService};
