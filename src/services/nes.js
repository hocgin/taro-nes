import request from '@/utils/request';
import qs from 'querystring';
import Config from "@/config";
import Utils from "@/utils/utils";

export default class API {

  /**
   * 获取首页推荐信息
   * @param payload
   */
  static listRecommendByIndex(payload) {
    return request(`/mina/${Config.getAppid()}/game/_paging`, {
      method: 'POST',
      body: {...payload}
    });
  }

  /**
   * 搜索
   * @param payload
   */
  static search(payload) {
    return API.listRecommendByIndex({...payload, page: 1, size: 3});
  }

}
