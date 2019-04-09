import Vue from 'vue';

import {baseUrl} from '@/config/utils';

/**
 * 用户模块的服务
 * @class
 */
class UserService {
  /**
   * @constructor
   */
  constructor() {
  }

  /**
   * 添加用户
   * @param {Object} data 用户信息
   * @return {Promise}
   */
  addUser(data) {
    return Vue.http.post(`${baseUrl}/user`, data);
  }

  /**
   * 用户列表接口
   * @return {Promise}
   */
  userInfo(id) {
    return Vue.http.get(`${baseUrl}/user/${id}`);
  }

  /**
   * 用户列表接口
   * @return {Promise}
   */
  userList() {
    return Vue.http.get(`${baseUrl}/user`);
  }

  /**
   * 删除用户
   * @param {number} id 用户id
   * @return {Promise}
   */
  delUser(id) {
    return Vue.http.delete(`${baseUrl}/user/${id}`);
  }

  /**
   * 修改用户
   * @param {Object} data 用户信息
   * @return {Promise}
   */
  saveUser(data) {
    return Vue.http.put(`${baseUrl}/user`, data);
  }


}

const userService = new UserService();

export {userService};
