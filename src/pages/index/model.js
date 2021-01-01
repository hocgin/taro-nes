import GameAPI from "@/services/nes";
import Utils from "@/utils/utils";
import Pages from "@/utils/pages";

const FILL_RECOMMEND = 'fillRecommend'
const FILL_SEARCH_RESULT = 'fillSearchResult'

const initState = {
  recommend: [],
  searchResult: [],
}

export default {
  namespace: 'index',
  state: initState,
  effects: {
    * listRecommend({payload = {}, callback, complete}, {put}) {
      let result = yield GameAPI.listRecommendByIndex(payload);
      if (Utils.ifFailShowMessage(result)) {
        yield put({type: FILL_RECOMMEND, payload: result.data});
        if (callback) callback(result);
      }
      if (complete) complete();
    },
    * search({payload = {}, callback, complete}, {put}) {
      let result = yield GameAPI.search(payload);
      if (Utils.ifFailShowMessage(result)) {
        yield put({type: FILL_SEARCH_RESULT, payload: result.data});
        if (callback) callback(result);
      }
      if (complete) complete();
    },
  },
  reducers: {
    [FILL_RECOMMEND](state, {payload}) {
      return {
        ...state,
        recommend: payload
      };
    },
    [FILL_SEARCH_RESULT](state, {payload}) {
      return {
        ...state,
        searchResult: payload
      };
    },
  },
};
