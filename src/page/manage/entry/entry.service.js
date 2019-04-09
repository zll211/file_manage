import Vue from 'vue';
import {baseUrl} from '@/config/utils';

class EntryService {
  constructor() {

  }

  //得到切片列表
  sliceList(params) {
    return Vue.http.get(`${baseUrl}/slice`, {params: params});
  }

  // 标记未知切片
  markUnknown(params) {
    return Vue.http.post(`${baseUrl}/mark_unknown`, params);
  }

  // 关联切片
  relateSlice(params) {
    return Vue.http.post(`${baseUrl}/relate`, params);
  }


  //得到分类列表
  cateList() {
    return Vue.http.get(`${baseUrl}/cate`);
  }

  //得到分类列表
  originList() {
    return Vue.http.get(`${baseUrl}/source`);
  }

  //查看病例信息
  pathologyMessages(pathology_id) {
    return Vue.http.get(`${baseUrl}/pathology/${pathology_id}`)
  }

  //删除切片
  deleteSlice(params) {// "Content-Type":"application/x-www-form-urlencoded"
    return Vue.http.put(`${baseUrl}/slice`, params)
  }

  // 切片录入
  sliceEntry(params) {
    return Vue.http.post(`${baseUrl}/scan_slice`, params);
  }

  getCateFile(params) {
    return Vue.http.get(`${baseUrl}/file`, {params: params});
  }

  moveFile(params) {
    return Vue.http.post(`${baseUrl}/file/move`, params);
  }

  autoMoveFile(params) {
    return Vue.http.post(`${baseUrl}/file/auto_move`, params);
  }

  autoRelate(params) {
    return Vue.http.get(`${baseUrl}/auto_relate`, {params: params});
  }

  //下载图片
  downloadJSON(params) {
    return Vue.http.get(`${baseUrl}/download/labels`, {params: params});
  }

  progressStatus(params) {
    return Vue.http.get(`${baseUrl}/file/queue_status`, {params: params});
  }

  batchDelete(params) {
    return Vue.http.delete(`${baseUrl}/slice`, {params: params});
  }

}

const entryService = new EntryService();
export {entryService}
