import Taro from "@tarojs/taro";

export const PageKey = {
  INDEX_PAGE: '/pages/index/index',
  GAME_PAGE: '/pages/game/index',
  NES_PAGE: '/pages/nes/index',
  APPLY_PAGE: '/pages/common/apply/index',
  USER_PAGE: '/pages/common/user/index',
  USER_DETAIL_PAGE: '/pages/common/user/detail/index',
};

let onCatch = e => console.error(e);
export default class Pages {

  static gotoUser() {
    return this.goto(PageKey.USER_PAGE)
      .catch(onCatch);
  }

  static gotoApply() {
    return this.goto(PageKey.APPLY_PAGE)
      .catch(onCatch);
  }

  static gotoUserDetail() {
    return this.goto(PageKey.USER_DETAIL_PAGE)
      .catch(onCatch);
  }

  static goto(url) {
    return Taro.navigateTo({url})
      .catch(onCatch);
  }

  static goBack() {
    return Taro.navigateBack({})
      .catch(onCatch);
  }

  static goHome() {
    return Taro.reLaunch({url: PageKey.INDEX_PAGE})
      .catch(onCatch);
  }
};
