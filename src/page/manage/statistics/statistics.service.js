import Vue from 'vue';

import {baseUrl} from '@/config/utils';

/**
 * 数据统计模块的服务
 * @class
 */
class StatisticsService {
  /**
   * @constructor
   */
  constructor() {
  }


  /**
   * 切片分类统计
   * @return {Promise}
   */
  queryPie() {
    return Vue.http.get(`${baseUrl}/dashboard/cate_slices`);
  }

  /**
   * 二级分类切片数量
   * @param {number} id 分类id
   * @return {Promise}
   */
  queryBar(id) {
    return Vue.http.get(`${baseUrl}/dashboard/cate_slices/${id}`);
  }

  /**
   * 切片录入数量
   * @return {Promise}
   */
  queryLine(params) {
    return Vue.http.get(`${baseUrl}/dashboard/slice_count`, {params: params});
  }



}

const statisticsService = new StatisticsService();

export {statisticsService};
