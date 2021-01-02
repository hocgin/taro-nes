import React from 'react';
import {Canvas, View} from "@tarojs/components";
import PropTypes from "prop-types";
import Taro from "@tarojs/taro";
import styles from './index.less';

class Index extends React.PureComponent {
  state = {
    width: 256,
    height: 240
  }

  componentWillMount() {

  }

  componentDidMount() {
    // 自动适配宽/高
    Taro.eventCenter.once(Taro.getCurrentInstance().router.onReady, this.resetScreen);
  }

  resetScreen = () => {
    let {
      height, width, onChangeScreen = () => {
      }
    } = this.props;

    let scale, innerHeight, innerWidth;
    // 如果仅指定宽，既高度自定义
    if (height == null) {
      innerWidth = width;
      scale = 256 / width;
      innerHeight = 240 / scale;
    } else {
      innerHeight = height;
      scale = 240 / height;
      innerWidth = 256 / scale;
    }
    this.setState({
      width: innerWidth,
      height: innerHeight,
      scale: scale
    }, onChangeScreen.bind(this, scale, innerWidth, innerHeight));
  };

  render() {
    let {canvasId} = this.props;
    let {width, height} = this.state;

    return (<View className={styles.component}>
      <Canvas id={canvasId} type='2d' style={{width: width, height: height}} />
    </View>);
  }
}

Index.propTypes = {
  canvasId: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  onChangeScreen: PropTypes.func,
};

export default Index;
