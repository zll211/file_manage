import Vue from 'vue';
import {baseUrl} from '@/config/utils';
class DNormalService{
  constructor(){};
  pathologyMessages(pathology_id){
    return Vue.http.get(`${baseUrl}/pathology/${pathology_id}`)
  }
}
const dNormalService = new DNormalService();

export {dNormalService};
