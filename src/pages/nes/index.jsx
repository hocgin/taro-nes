import React, {Component} from 'react'
import {connect} from "react-redux";
import {saveGameProgress, loadUrl, buttonUp, buttonDown, loadGameProgress} from '@/utils/nes-embed'
import PageLayout from '@/layouts/common/PageLayout';
import Taro from "@tarojs/taro";
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
    Taro.eventCenter.once(Taro.getCurrentInstance().router.onReady, () => {
      loadUrl('gview', scale, Config.getDownloadUrl(gameUrl, 'xx.nes'));
    });
  }

  componentWillUnmount() {
    // ..页面卸载时触发，如 redirectTo 或 navigateBack 到其他页面时
  }

  render() {
    let {apps} = this.props;
    let {width, height, isLoading} = this.state;

    // - 放大
    // - 声音 25.6
    return (<PageLayout containerClassName={styles.page}>
      <View style='width: 100%'>
        {/*256px 240px*/}
        <Canvas id='gview' type='2d' style={{width: width, height: height}} />
      </View>
      {/*加载和邀请*/}
      <View className={styles.toolbar}>
        <View onClick={this.onClickLoad.bind(this)}
              className={classnames(styles.nesBtn, styles.loadBtn, {
                [styles.isDisabled]: isLoading
              })}>{isLoading ? '加载中..' : '加载'}</View>
        <View className={classnames(styles.nesBtn)} onClick={this.onClickSave.bind(this)}>存档</View>
        <View className={classnames(styles.nesBtn)} onClick={this.onClickLoadSave.bind(this)}>加载存档</View>
      </View>

      {/*控制面板*/}
      <View className={styles.ctls}>
        <View className={styles.row1}>
          <View className={styles.rl}>
            <View className={classnames(styles.nesBtn, styles.t)}
                  onTouchStart={this.onTouchStart.bind(this, Controller.BUTTON_UP)}
                  onTouchEnd={this.onTouchEnd.bind(this, Controller.BUTTON_UP)}>上</View>
            <View className={classnames(styles.nesBtn, styles.d)}
                  onTouchStart={this.onTouchStart.bind(this, Controller.BUTTON_DOWN)}
                  onTouchEnd={this.onTouchEnd.bind(this, Controller.BUTTON_DOWN)}>下</View>
            <View className={classnames(styles.nesBtn, styles.l)}
                  onTouchStart={this.onTouchStart.bind(this, Controller.BUTTON_LEFT)}
                  onTouchEnd={this.onTouchEnd.bind(this, Controller.BUTTON_LEFT)}>左</View>
            <View className={classnames(styles.nesBtn, styles.r)}
                  onTouchStart={this.onTouchStart.bind(this, Controller.BUTTON_RIGHT)}
                  onTouchEnd={this.onTouchEnd.bind(this, Controller.BUTTON_RIGHT)}>右</View>
          </View>
          <View className={styles.rr}>
            <View className={classnames(styles.nesBtn, styles.isSuccess, styles.b)}
                  onTouchStart={this.onTouchStart.bind(this, Controller.BUTTON_B)}
                  onTouchEnd={this.onTouchEnd.bind(this, Controller.BUTTON_B)}>B</View>
            <View className={classnames(styles.nesBtn, styles.isPrimary, styles.a)}
                  onTouchStart={this.onTouchStart.bind(this, Controller.BUTTON_A)}
                  onTouchEnd={this.onTouchEnd.bind(this, Controller.BUTTON_A)}>A</View>
          </View>
        </View>
        <View className={styles.row2}>
          <View className={classnames(styles.nesBtn, styles.isWarning, styles.select)}
                onTouchStart={this.onTouchStart.bind(this, Controller.BUTTON_SELECT)}
                onTouchEnd={this.onTouchEnd.bind(this, Controller.BUTTON_SELECT)}>选择</View>
          <View className={classnames(styles.nesBtn, styles.isError, styles.start)}
                onTouchStart={this.onTouchStart.bind(this, Controller.BUTTON_START)}
                onTouchEnd={this.onTouchEnd.bind(this, Controller.BUTTON_START)}>开始</View>
        </View>
      </View>
    </PageLayout>);
  }

  onTouchStart(ctlKey) {
    console.log('ctlKey onTouchStart', ctlKey);
    buttonDown(1, ctlKey)
  }

  onTouchEnd(ctlKey) {
    console.log('ctlKey onTouchEnd', ctlKey);
    buttonUp(1, ctlKey)
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
