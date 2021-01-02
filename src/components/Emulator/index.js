import React from 'react';
import {View} from "@tarojs/components";
import styles from './index.less';

let Screen = (props) => {
  return (<View>

  </View>);
};

class Index extends React.PureComponent {
  render() {
    let {} = this.props;
    return (<View className={styles.component}>
      <text>tpl</text>
    </View>);
  }
}

export default Index;
