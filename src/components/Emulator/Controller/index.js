import React from 'react';
import {View} from "@tarojs/components";
import classnames from "classnames";
import {Controller} from "jsnes";
import PropTypes from "prop-types";
import Taro from "@tarojs/taro";
import Config from "@/config";

import styles from './index.less';

let innerAudioContext;

class Index extends React.PureComponent {


  componentDidMount() {
    innerAudioContext = Taro.createInnerAudioContext();
    innerAudioContext.autoplay = true;
  }

  componentWillUnmount() {
    innerAudioContext.destroy();
  }

  render() {
    let {isLoading, onClickLoadProgress, onClickSaveProgress} = this.props;
    return (<View className={styles.component}>
      <View className={styles.toolbar}>
        <View className={classnames(styles.nesBtn, styles.saveProgress)}
              onClick={onClickSaveProgress.bind(this)}>存档</View>
        <View className={classnames(styles.nesBtn, styles.loadProgress)}
              onClick={onClickLoadProgress.bind(this)}>读档</View>
      </View>
      <View className={styles.ctls}>
        <View className={styles.row1}>
          <View className={styles.rl}>
            <View className={classnames(styles.nesBtn, styles.t)}
                  onClick={this.onKeyButtonClick.bind(this, Controller.BUTTON_UP)}
                  onTouchStart={this.onKeyButtonDown.bind(this, Controller.BUTTON_UP)}
                  onTouchEnd={this.onKeyButtonUp.bind(this, Controller.BUTTON_UP)}>上</View>
            <View className={classnames(styles.nesBtn, styles.d)}
                  onClick={this.onKeyButtonClick.bind(this, Controller.BUTTON_DOWN)}
                  onTouchStart={this.onKeyButtonDown.bind(this, Controller.BUTTON_DOWN)}
                  onTouchEnd={this.onKeyButtonUp.bind(this, Controller.BUTTON_DOWN)}>下</View>
            <View className={classnames(styles.nesBtn, styles.l)}
                  onClick={this.onKeyButtonClick.bind(this, Controller.BUTTON_LEFT)}
                  onTouchStart={this.onKeyButtonDown.bind(this, Controller.BUTTON_LEFT)}
                  onTouchEnd={this.onKeyButtonUp.bind(this, Controller.BUTTON_LEFT)}>左</View>
            <View className={classnames(styles.nesBtn, styles.r)}
                  onClick={this.onKeyButtonClick.bind(this, Controller.BUTTON_RIGHT)}
                  onTouchStart={this.onKeyButtonDown.bind(this, Controller.BUTTON_RIGHT)}
                  onTouchEnd={this.onKeyButtonUp.bind(this, Controller.BUTTON_RIGHT)}>右</View>
          </View>
          <View className={styles.rr}>
            <View className={classnames(styles.nesBtn, styles.isSuccess, styles.b)}
                  onClick={this.onKeyButtonClick.bind(this, Controller.BUTTON_B)}
                  onTouchStart={this.onKeyButtonDown.bind(this, Controller.BUTTON_B)}
                  onTouchEnd={this.onKeyButtonUp.bind(this, Controller.BUTTON_B)}>B</View>
            <View className={classnames(styles.nesBtn, styles.isPrimary, styles.a)}
                  onClick={this.onKeyButtonClick.bind(this, Controller.BUTTON_A)}
                  onTouchStart={this.onKeyButtonDown.bind(this, Controller.BUTTON_A)}
                  onTouchEnd={this.onKeyButtonUp.bind(this, Controller.BUTTON_A)}>A</View>
          </View>
        </View>
        <View className={styles.row2}>
          <View className={classnames(styles.nesBtn, styles.isWarning, styles.select)}
                onClick={this.onKeyButtonClick.bind(this, Controller.BUTTON_SELECT)}
                onTouchStart={this.onKeyButtonDown.bind(this, Controller.BUTTON_SELECT)}
                onTouchEnd={this.onKeyButtonUp.bind(this, Controller.BUTTON_SELECT)}>选择</View>
          <View className={classnames(styles.nesBtn, styles.isError, styles.start)}
                onClick={this.onKeyButtonClick.bind(this, Controller.BUTTON_START)}
                onTouchStart={this.onKeyButtonDown.bind(this, Controller.BUTTON_START)}
                onTouchEnd={this.onKeyButtonUp.bind(this, Controller.BUTTON_START)}>开始</View>
        </View>
      </View>
    </View>);
  }

  onKeyButtonClick = (key) => {
    this.onKeyButtonDown(key);
    this.onKeyButtonUp(key);
  };

  onKeyButtonDown = (key) => {
    let {onKeyButtonDown} = this.props;
    onKeyButtonDown(key);
    if (key === Controller.BUTTON_A) {
      this.playAudio(Config.getMusicA())
    } else if (key === Controller.BUTTON_B) {
      this.playAudio(Config.getMusicB())
    } else if (key === Controller.BUTTON_START) {
      this.playAudio(Config.getMusicStart())
    } else if (key === Controller.BUTTON_SELECT) {
      this.playAudio(Config.getMusicSelect())
    }
  };

  onKeyButtonUp = (key) => {
    let {onKeyButtonUp} = this.props;
    onKeyButtonUp(key);
  };

  playAudio = (src) => {
    return new Promise((resolve, reject) => {
      innerAudioContext.src = src;
      innerAudioContext.play();
      resolve();
    });
  };

}

Index.propTypes = {
  onClickLoadProgress: PropTypes.func.isRequired,
  onClickSaveProgress: PropTypes.func.isRequired,
  onKeyButtonDown: PropTypes.func.isRequired,
  onKeyButtonUp: PropTypes.func.isRequired,
};

export default Index;
