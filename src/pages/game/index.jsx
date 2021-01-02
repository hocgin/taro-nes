import React, {Component} from 'react'
import {connect} from "react-redux";
import {saveGameProgress, loadUrl, buttonUp, buttonDown, loadGameProgress} from '@/utils/nes-embed'
import PageLayout from '@/layouts/common/PageLayout';
import Taro from "@tarojs/taro";
import Emulator from '@/components/Emulator';
import {Controller} from "jsnes";
import {Button, Canvas, Image, Text, View} from "@tarojs/components";
import Utils from "@/utils/utils";
import classnames from "classnames";
import Config from "@/config";
import {setStorageSync, getStorageSync, Keys} from "@/utils/storage";

import styles from './index.less';

@connect(({apps}) => ({
  // apps
}), (dispatch) => ({
  // listCoupon: (args = {}) => dispatch({type: 'apps/listCoupon', ...args})
}))
class Index extends Component {
  state = {
    width: null,
    height: null,
    scale: null,
    gameUrl: null,
    isLoading: false
  };

  componentDidMount() {
    let {gameUrl} = Taro.getCurrentInstance().router.params;
    let {WIN_WIDTH, WIN_HEIGHT} = Utils.getSystemInfo();
    let scale = 256 / WIN_WIDTH;
    // 256/WIN_WIDTH = 240 / x
    this.setState({
      scale: scale,
      width: WIN_WIDTH,
      height: 240 / scale,
      gameUrl: gameUrl,
    });

    // 自动加载 ROM
    // Taro.eventCenter.once(Taro.getCurrentInstance().router.onReady, () => {
    //   loadUrl('gview', scale, Config.getDownloadUrl(gameUrl, 'xx.nes'));
    // });
  }

  componentWillUnmount() {
    // ..页面卸载时触发，如 redirectTo 或 navigateBack 到其他页面时
  }

  render() {
    let {apps} = this.props;
    let {width, height, isLoading} = this.state;
    console.log('state', this.state);
    let {WIN_WIDTH, WIN_HEIGHT} = Utils.getSystemInfo();

    // - 放大
    // - 声音 25.6
    return (<PageLayout containerClassName={styles.page}>
      <View style='width: 100%'>
        <Emulator player={1} width={WIN_WIDTH} />
      </View>
    </PageLayout>);
  }

  onClickLoad() {
    let {scale, gameUrl, isLoading} = this.state;
    if (isLoading) {
      return;
    }
    this.setState({isLoading: true});
    this.setState({isLoading: false});
  };

  onClickSave() {
    let data = saveGameProgress();
    if (data !== null) {
      setStorageSync(Keys.GAME_SAVE, data);
    }
  }

  onClickLoadSave() {
    let data = getStorageSync(Keys.GAME_SAVE);
    if (data !== null) {
      loadGameProgress(data);
    }
  }


}

export default Index;
