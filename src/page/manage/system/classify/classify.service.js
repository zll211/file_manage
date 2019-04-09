import Vue from 'vue';

import {baseUrl} from '@/config/utils';

/**
 * 分类模块的服务
 * @class
 */
class ClassifyService {
  /**
   * @constructor
   */
  constructor() {
  }

  /**
   * 添加分类
   * @param {Object} data 分类信息
   * @param {string} data.cate_name 分类名称
   * @param {number=} data.parent_id 分类父id
   * @return {Promise}
   */
  addCate(data) {
    return Vue.http.post(`${baseUrl}/cate`, data);
  }

  /**
   * 分类列表接口
   * @return {Promise}
   */
  cateList(params) {
    return Vue.http.get(`${baseUrl}/cate`, {params: params});
  }

  /**
   * 删除分类
   * @param {number} id 分类id
   * @return {Promise}
   */
  delCate(id) {
    return Vue.http.delete(`${baseUrl}/cate/${id}`);
  }

  /**
   * 修改分类
   * @param {number} id 分类id
   * @param {Object} data 分类信息
   * @param {string} data.cate_name 分类名称
   * @param {number=} data.parent_id 分类父id
   * @return {Promise}
   */
  saveCate(id, data) {
    return Vue.http.put(`${baseUrl}/cate/${id}`, data);
  }

  /**
   * 获取路径下的文件夹
   * @param {Object} params
   * @return {Promise}
   */
  getFileDir(params) {
    return Vue.http.get(`${baseUrl}/file/children`, {params: params});
  }

}

const classifyService = new ClassifyService();

export {classifyService};
