import Vue from 'vue';

import {baseUrl} from '@/config/utils';

/**
 * 扫描仪模块的服务
 * @class
 */
class OriginService {
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
  addOrigin(data) {
    return Vue.http.post(`${baseUrl}/source`, data);
  }

  /**
   * 扫描仪列表接口
   * @return {Promise}
   */
  originList(params) {
    return Vue.http.get(`${baseUrl}/source`,{params:params});
  }

  /**
   * 删除扫描仪
   * @param {number} id 扫描仪id
   * @return {Promise}
   */
  delOrigin(id) {
    return Vue.http.delete(`${baseUrl}/source/${id}`);
  }

  /**
   * 修改扫描仪
   * @param {number} id 扫描仪id
   * @param {Object} data 扫描仪信息
   * @return {Promise}
   */
  saveOrigin(id, data) {
    return Vue.http.put(`${baseUrl}/source/${id}`, data);
  }

  exportData() {
    return Vue.http.get(`${baseUrl}/export/excel`);
  }
}

const originService = new OriginService();

export {originService};
