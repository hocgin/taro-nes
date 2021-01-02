import Taro from '@tarojs/taro';
import Utils from "@/utils/utils";

export const Keys = {
  USER_INFO: 'userInfo',
  GAME_SAVE: 'gameSave',
  getGameSaveRom: (gameUrl, index = 0) => {
    let gameMd5 = Utils.md5(`${gameUrl}-${index}`);
    return `${Keys.GAME_SAVE}-${gameMd5}`;
  },
};

export function setStorage(key, val) {
  return Taro.setStorage({key: key, data: val})
    .then(res => console.log(res))
    .catch(res => console.warn(res));
}

export function setStorageSync(key, val) {
  Taro.setStorageSync(key, val);
}

export function getStorage(key) {
  return Taro.getStorage({key});
}

export function getStorageSync(key) {
  return Taro.getStorageSync(key);
}

export function removeStorage(key) {
  return Taro.removeStorage({key});
}

export function removeStorageSync(key) {
  Taro.removeStorageSync(key);
}

export function clearStorage() {
  return Taro.clearStorage();
}

export function clearStorageSync() {
  Taro.clearStorageSync();
}
