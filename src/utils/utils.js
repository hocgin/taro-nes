import Taro from "@tarojs/taro";
import md5 from 'js-md5';
import ab2str from "arraybuffer-to-string";

export default class Utils {
  static mockSuccess(data) {
    return {
      success: true,
      data: data
    };
  }

  static isSuccess(result) {
    return result && result.success;
  }

  static ifFailShowMessage(result) {
    if (Utils.isSuccess(result)) {
      return true;
    }
    Taro.showToast({title: result?.message, icon: 'none'})
      .then(r => console.debug(r));
    return false;
  }

  static getSystemInfo() {
    let sysInfo = {};

    let res = Taro.getSystemInfoSync();

    sysInfo.WIN_WIDTH = res.screenWidth;
    sysInfo.WIN_HEIGHT = res.screenHeight;
    sysInfo.IS_IOS = /ios/i.test(res.system);
    sysInfo.IS_ANDROID = /android/i.test(res.system);
    sysInfo.STATUS_BAR_HEIGHT = res.statusBarHeight;
    sysInfo.DEFAULT_HEADER_HEIGHT = 46;

    // res.screenHeight - res.windowHeight - res.statusBarHeight
    sysInfo.DEFAULT_CONTENT_HEIGHT = res.screenHeight - res.statusBarHeight - sysInfo.DEFAULT_HEADER_HEIGHT;

    sysInfo.IS_APP = true;
    sysInfo.showAlert = function (options) {
      options.showCancel = false;
      sysInfo.showModal(options);
    };

    sysInfo.showConfirm = function (options) {
      sysInfo.showModal(options);
    };
    return sysInfo;
  }

  static md5(str) {
    let hash = md5.create();
    hash.update('Message to hash');
    return hash.hex();
  }

  static ab2str(arr) {
    let str = '';
    let chunk = 8 * 1024; // 8k
    let i;
    for (i = 0; i < arr.byteLength / chunk; i++) {
      str += ab2str(arr.slice(i * chunk, (i + 1) * chunk), 'binary');
    }
    str += ab2str(arr.slice(i * chunk), 'binary');
    return str;
  }
}
