import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { TVShow } from '../../api';
import MovieItem from '../MovieItem';
import { ShowIf } from '../../utils';

export default class TVShowListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: false,
      isLoadMore: false,
      page: 1,
      total: 1,
      totalPage: 1
    };
    switch (this.props.type) {
      case 'airing_today':
        this.tvAPI = TVShow.actions.airing_today;
        break;
      case 'on_the_air':
        this.tvAPI = TVShow.actions.on_the_air;
        break;
      case 'popular':
        this.tvAPI = TVShow.actions.popular;
        break;
      case 'top_rated_tv':
        this.tvAPI = TVShow.actions.top_rated_tv;
        break;
      default: break;
    }
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.getListMovieFromNowPlaying();
  }

  getListMovieFromNowPlaying() {
    this.setState({isLoading: true});
    this.tvAPI.request({page: this.state.page}).then(response => {
      this.setState({
        isLoading: false,
        total: response.total_results,
        totalPage: response.total_pages,
        data: response.results
      });
    }).catch(error => {
      this.setState({isLoading: false});
    });
  }

  loadMore() {
    if (this.state.page < this.state.totalPage) {
      this.setState({isLoadMore: true, page: this.state.page + 1}, () => {
        this.discoverAPI.request({page: this.state.page}).then(response => {
          this.setState({
            isLoadMore: false,
            total: response.total_results,
            totalPage: response.total_pages,
            data: [...this.state.data, ...response.results]
          });
        }).catch(error => {
          this.setState({isLoadMore: false});
        });
      });
    }
  }

  renderLoadMore = () => {
    if (!this.state.isLoadMore) {
      return null;
    }
    return (
      <View style={{marginBottom: 10}}>
        <ActivityIndicator animating size="small" />
      </View>
    );
  }

  renderItem = ({item}) => (
    <MovieItem type={this.props.type} {...item} />
  );

  render() {
    return (
      <View style={styles.container}>
        <ShowIf condition={this.state.isLoading}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100}}>
            <ActivityIndicator animating size="small" />
          </View>
        </ShowIf>
        <FlatList
          data={this.state.data}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={this.renderLoadMore}
          renderItem={this.renderItem}
          onEndReached={this.loadMore}
          onEndReachedThreshold={100}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingLeft: 22,
    paddingBottom: 0
  }
});