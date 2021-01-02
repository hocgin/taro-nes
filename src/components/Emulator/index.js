import React from 'react';
import {Canvas, View} from "@tarojs/components";
import Screen from '@/components/Emulator/Screen';
import Controller from '@/components/Emulator/Controller';
import {
  saveGameProgress, loadGameProgress, loadUrl,
  buttonUp, buttonDown, refreshCanvas
} from '@/utils/nes-embed'
import PropTypes from "prop-types";
import Taro from "@tarojs/taro";
import Utils from "@/utils/utils";
import Config from "@/config";
import {getStorageSync, Keys, setStorageSync} from "@/utils/storage";

import styles from './index.less';

const canvasId = 'gview';

class Index extends React.PureComponent {
  state = {};

  componentDidMount() {
  }


  render() {
    let {width, height} = this.props;
    return (<View className={styles.component}>
      <Screen canvasId={canvasId} width={width} height={height}
              onChangeScreen={this.onChangeScreen} />
      <Controller onClickLoadProgress={this.onClickLoadProgress}
                  onClickSaveProgress={this.onClickSaveProgress}
                  onKeyButtonDown={this.onKeyButtonDown}
                  onKeyButtonUp={this.onKeyButtonUp} />
    </View>);
  }

  onClickSaveProgress = () => {
    let data = saveGameProgress();
    setStorageSync(Keys.GAME_SAVE, data);
  }

  onClickLoadProgress = () => {
    let data = getStorageSync(Keys.GAME_SAVE);
    if (data !== null) {
      loadGameProgress(data);
    }
  }

  onKeyButtonUp = (key) => {
    let {player} = this.props;
    buttonUp(player, key);
  };

  onKeyButtonDown = (key) => {
    let {player} = this.props;
    buttonDown(player, key);
  };

  onChangeScreen = (scale, width, height) => {
    let {gameUrl} = Taro.getCurrentInstance().router.params;

    // 刷新屏幕并加载游戏
    refreshCanvas(canvasId, scale, width, height)
      .then(_ => loadUrl('gview', scale, Config.getDownloadUrl(gameUrl, 'xx.nes')));
  };
}


Index.propTypes = {
  player: PropTypes.number.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default Index;
