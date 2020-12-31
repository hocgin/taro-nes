import React, {Component} from 'react'
import {connect} from "react-redux";
import {loadData, loadUrl, buttonUp, buttonDown} from '@/utils/nes-embed'
import PageLayout from '@/layouts/common/PageLayout';
import Taro from "@tarojs/taro";
import {Controller} from "jsnes";
import {Button, Canvas, Image, Text, View} from "@tarojs/components";
import styles from './index.less';


@connect(({apps}) => ({
  // apps
}), (dispatch) => ({
  // listCoupon: (args = {}) => dispatch({type: 'apps/listCoupon', ...args})
}))
class Index extends Component {

  componentDidMount() {
    Taro.eventCenter.once(Taro.getCurrentInstance().router.onReady, () => {
      // loadUrl('gview', 'http://cdn.hocgin.top/InterglacticTransmissing.nes')
    });
  }

  componentWillUnmount() {
    // ..页面卸载时触发，如 redirectTo 或 navigateBack 到其他页面时
  }

  render() {
    let {apps} = this.props;
    // - 放大
    // - 声音
    return (<PageLayout containerClassName={styles.page}>
      <View style='width: 100%'>
        {/*256px 240px*/}
        <Canvas id='gview' type='2d' style='width: 256px;height: 240px' />
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
    loadUrl('gview', 'http://cdn.hocgin.top/InterglacticTransmissing.nes', this)
  };


}

export default Index;
