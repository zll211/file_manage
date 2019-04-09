import Vue from 'vue';
import {baseUrl} from '@/config/utils';
class SliceService {
  constructor(){

  }
  //得到分类列表
  cateList() {

    return Vue.http.get(`${baseUrl}/slice_count`);
  }
  //得到切片列表
  sliceList(params){
    return Vue.http.get(`${baseUrl}/slice`,{params:params});
  }
  //删除切片
  deleteSlice(params){
    return Vue.http.put(`${baseUrl}/slice`,params)
  }
  //查看病例信息
  pathologyMessages(pathology_id){
    return Vue.http.get(`${baseUrl}/pathology/${pathology_id}`)
  }
  //下载图片
  downloadJSON(params){
    return Vue.http.get(`${baseUrl}/download/labels`,{params:params});
  }

  // 关联切片
  sliceUpdate(params) {
    return Vue.http.put(`${baseUrl}/slice_update`, params);
  }

  batchDelete(params) {
    return Vue.http.delete(`${baseUrl}/slice`, {params: params});
  }

  sliceDuplicate(params) {
    return Vue.http.get(`${baseUrl}/slice_duplicate`, {params: params});
  }


  relateJSON(params) {
    return Vue.http.post(`${baseUrl}/relate_json`, params);
  }

}
const sliceService = new SliceService();

export {sliceService};
