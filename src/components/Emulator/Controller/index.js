import React from 'react';
import {View} from "@tarojs/components";
import classnames from "classnames";
import {Controller} from "jsnes";
import PropTypes from "prop-types";

import styles from './index.less';

class Index extends React.PureComponent {

  render() {
    let {isLoading, onClickLoadProgress, onClickSaveProgress, onKeyButtonDown, onKeyButtonUp} = this.props;
    return (<View className={styles.component}>
      <View className={styles.toolbar}>
        <View className={classnames(styles.nesBtn)} onClick={onClickSaveProgress.bind(this)}>存档</View>
        <View className={classnames(styles.nesBtn)} onClick={onClickLoadProgress.bind(this)}>加载存档</View>
      </View>
      <View className={styles.ctls}>
        <View className={styles.row1}>
          <View className={styles.rl}>
            <View className={classnames(styles.nesBtn, styles.t)}
                  onTouchStart={onKeyButtonDown.bind(this, Controller.BUTTON_UP)}
                  onTouchEnd={onKeyButtonUp.bind(this, Controller.BUTTON_UP)}>上</View>
            <View className={classnames(styles.nesBtn, styles.d)}
                  onTouchStart={onKeyButtonDown.bind(this, Controller.BUTTON_DOWN)}
                  onTouchEnd={onKeyButtonUp.bind(this, Controller.BUTTON_DOWN)}>下</View>
            <View className={classnames(styles.nesBtn, styles.l)}
                  onTouchStart={onKeyButtonDown.bind(this, Controller.BUTTON_LEFT)}
                  onTouchEnd={onKeyButtonUp.bind(this, Controller.BUTTON_LEFT)}>左</View>
            <View className={classnames(styles.nesBtn, styles.r)}
                  onTouchStart={onKeyButtonDown.bind(this, Controller.BUTTON_RIGHT)}
                  onTouchEnd={onKeyButtonUp.bind(this, Controller.BUTTON_RIGHT)}>右</View>
          </View>
          <View className={styles.rr}>
            <View className={classnames(styles.nesBtn, styles.isSuccess, styles.b)}
                  onTouchStart={onKeyButtonDown.bind(this, Controller.BUTTON_B)}
                  onTouchEnd={onKeyButtonUp.bind(this, Controller.BUTTON_B)}>B</View>
            <View className={classnames(styles.nesBtn, styles.isPrimary, styles.a)}
                  onTouchStart={onKeyButtonDown.bind(this, Controller.BUTTON_A)}
                  onTouchEnd={onKeyButtonUp.bind(this, Controller.BUTTON_A)}>A</View>
          </View>
        </View>
        <View className={styles.row2}>
          <View className={classnames(styles.nesBtn, styles.isWarning, styles.select)}
                onTouchStart={onKeyButtonDown.bind(this, Controller.BUTTON_SELECT)}
                onTouchEnd={onKeyButtonUp.bind(this, Controller.BUTTON_SELECT)}>选择</View>
          <View className={classnames(styles.nesBtn, styles.isError, styles.start)}
                onTouchStart={onKeyButtonDown.bind(this, Controller.BUTTON_START)}
                onTouchEnd={onKeyButtonUp.bind(this, Controller.BUTTON_START)}>开始</View>
        </View>
      </View>
    </View>);
  }

}

Index.propTypes = {
  onClickLoadProgress: PropTypes.func.isRequired,
  onClickSaveProgress: PropTypes.func.isRequired,
  onKeyButtonDown: PropTypes.func.isRequired,
  onKeyButtonUp: PropTypes.func.isRequired,
};

export default Index;
