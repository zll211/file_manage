import Vue from 'vue';

import {baseUrl} from '@/config/utils';

/**
 * 角色模块的服务
 * @class
 */
class RoleService {
  /**
   * @constructor
   */
  constructor() {
  }

  /**
   * 添加角色
   * @param {Object} data 角色信息
   * @param {string} data.role_name 角色名称
   * @param {Array} data.cates 角色分类
   * @return {Promise}
   */
  addRole(data) {
    return Vue.http.post(`${baseUrl}/role`, data);
  }

  /**
   * 角色列表接口
   * @return {Promise}
   */
  roleList() {
    return Vue.http.get(`${baseUrl}/role`);
  }

  /**
   * 删除角色
   * @param {number} id 角色id
   * @return {Promise}
   */
  delRole(id) {
    return Vue.http.delete(`${baseUrl}/role/${id}`);
  }

  /**
   * 修改角色
   * @param {Object} data 角色信息
   * @param {number} data.id 角色id
   * @param {string} data.role_name 角色名称
   * @param {Array} data.cates 角色分类
   * @return {Promise}
   */
  saveRole(data) {
    return Vue.http.put(`${baseUrl}/role`, data);
  }


}

const roleService = new RoleService();

export {roleService};
