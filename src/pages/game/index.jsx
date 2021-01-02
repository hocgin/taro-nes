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
  state = {};

  componentDidMount() {
  }

  componentWillUnmount() {
    // ..页面卸载时触发，如 redirectTo 或 navigateBack 到其他页面时
  }

  render() {
    let {apps} = this.props;
    let {WIN_WIDTH, WIN_HEIGHT} = Utils.getSystemInfo();

    // - 放大
    // - 声音 25.6
    return (<PageLayout title={Taro.getCurrentInstance().router.params?.gameName} containerClassName={styles.page}>
      <View style='width: 100%'>
        <Emulator player={1} width={WIN_WIDTH} />
      </View>
    </PageLayout>);
  }

}

export default Index;
