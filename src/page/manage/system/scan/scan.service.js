import Vue from 'vue';

import {baseUrl} from '@/config/utils';

/**
 * 扫描仪模块的服务
 * @class
 */
class ScanService {
  /**
   * @constructor
   */
  constructor() {
  }

  /**
   * 添加扫描仪
   * @param {Object} data 扫描仪信息
   * @param {string} data.name 扫描仪名称
   * @param {string} data.ip 扫描仪ip
   * @return {Promise}
   */
  addScan(data) {
    return Vue.http.post(`${baseUrl}/scanistor`, data);
  }

  /**
   * 扫描仪列表接口
   * @return {Promise}
   */
  scanList(params) {
    return Vue.http.get(`${baseUrl}/scanistor`, {params: params});
  }

  /**
   * 删除扫描仪
   * @param {number} id 扫描仪id
   * @return {Promise}
   */
  delScan(id) {
    return Vue.http.delete(`${baseUrl}/scanistor/${id}`);
  }

  /**
   * 修改扫描仪
   * @param {Object} data 扫描仪信息
   * @param {string} data.name 扫描仪名称
   * @param {string} data.ip 扫描仪ip
   * @return {Promise}
   */
  saveScan(data) {
    return Vue.http.put(`${baseUrl}/scanistor`, data);
  }

  getScanLog() {
    return Vue.http.get(`${baseUrl}/log_config`);
  }

  saveScanLog(data) {
    return Vue.http.post(`${baseUrl}/log_config`, data);
  }

}

const scanService = new ScanService();

export {scanService};
