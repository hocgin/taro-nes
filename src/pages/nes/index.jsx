import React, {Component} from 'react'
import {connect} from "react-redux";
import {loadData, loadUrl, buttonUp, buttonDown, screenHeight, screenWidth} from '@/utils/nes-embed'
import PageLayout from '@/layouts/common/PageLayout';
import Taro from "@tarojs/taro";
import {Controller} from "jsnes";
import {Button, Canvas, Image, Text, View} from "@tarojs/components";
import Utils from "@/utils/utils";
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
  };

  componentDidMount() {
    let {WIN_WIDTH, WIN_HEIGHT} = Utils.getSystemInfo();
    let scale = 256 / WIN_WIDTH;
    // 256/WIN_WIDTH = 240 / x
    this.setState({
      scale: scale,
      width: WIN_WIDTH,
      height: 240 / scale,
    });

    Taro.eventCenter.once(Taro.getCurrentInstance().router.onReady, () => {
      // loadUrl('gview', 'http://cdn.hocgin.top/InterglacticTransmissing.nes')
    });
  }

  componentWillUnmount() {
    // ..页面卸载时触发，如 redirectTo 或 navigateBack 到其他页面时
  }

  render() {
    let {apps} = this.props;
    let {width, height} = this.state;

    // - 放大
    // - 声音 25.6
    return (<PageLayout containerClassName={styles.page}>
      <View style='width: 100%'>
        {/*256px 240px*/}
        <Canvas id='gview' type='2d' style={{width: width, height: height}} />
      </View>

      <Button onClick={this.onClickLoad.bind(this)}>加载</Button>
      <View style='width: 100%'
            onTouchStart={this.onTouchStart.bind(this, Controller.BUTTON_START)}
            onTouchEnd={this.onTouchEnd.bind(this, Controller.BUTTON_START)}>操作</View>
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
    let {scale} = this.state;
    loadUrl('gview', scale, 'http://cdn.hocgin.top/InterglacticTransmissing.nes');
  };


}

export default Index;
