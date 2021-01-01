import React, {Component} from 'react'
import {connect} from "react-redux";
import Taro from '@tarojs/taro';
import Events from "@/utils/events";
import {PageKey} from "@/utils/pages";
import {View, Text, Image, WebView} from '@tarojs/components';
import RowCard from "@/components/RowCard";
import PageLayout from '@/layouts/common/PageLayout';
import SearchBar from '@/components/common/SearchBar';
import ColorTitle from "@/components/common/ColorTitle";

import styles from './index.less';

@connect(({index}) => ({
  index
}), (dispatch) => ({
  $listRecommend: (args = {}) => dispatch({type: 'index/listRecommend', ...args}),
  $search: (args = {}) => dispatch({type: 'index/search', ...args})
}))
class Index extends Component {
  state = {
    avatarUrl: null,
  }

  componentWillMount() {
    let {$listRecommend} = this.props;
    Events.onUpdateUser(this.refreshAvatarUrl);
    $listRecommend({payload: {}});
  }

  componentDidShow() {
    this.refreshAvatarUrl();
  }

  componentWillUnmount() {
    Events.offUpdateUser(this.refreshAvatarUrl);
  }

  refreshAvatarUrl = () => {
    let avatarUrl = Taro.Current.app.getUserInfo(false)?.avatarUrl;
    this.setState({
      avatarUrl: avatarUrl
    });
  };

  render() {
    let {avatarUrl} = this.state;
    let {index} = this.props;

    return (<PageLayout avatarUrl={avatarUrl} hideBarton hideAvatar={false} title='首页'
                        containerClassName={styles.page}>
      <View className={styles.indexBg}>
        <SearchBar className={styles.searchBar} data={index?.searchResult} onChangeKeyword={this.onChangeKeyword} />
      </View>
      <View className={styles.containerWrapper}>
        <View className={styles.header}>
          <ColorTitle className={styles.title}>最新推荐</ColorTitle>
          <Text />
        </View>
        <View className={styles.container}>
          {(index?.recommend || []).map(({remark, title, logoUrl, tags, viewUrls, gameUrl}) =>
            <RowCard className={styles.rowCard} logoUrl={logoUrl} viewUrls={viewUrls} remark={remark} title={title}
                     tags={tags} href={{mini: {path: `${PageKey.NES_PAGE}?gameUrl=${gameUrl}`}}} />)}
        </View>
      </View>

    </PageLayout>);
  }

  onChangeKeyword = (e) => {
    let keyword = e?.detail?.value;
    let {$search} = this.props;
    $search({payload: {keyword}});
  };

}

export default Index;
