import React, {Component} from 'react'
import {
  Button,
  Icon,
  Spinner,
  Card,
  CardItem,
  DeckSwiper
} from 'native-base';
import { StyleSheet, View, Text, Image, FlatList} from 'react-native';
import { List, ListItem } from 'react-native-elements';

export default class Match extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: []
    }
    this.host = 'https://s3.amazonaws.com/picyoubucket/public/'
  }
  componentDidMount() {
    const { matches } = this.props.stores;
    this.setState({ loading: true });
    matches.fetchPostList((postList) => {
      console.log(postList)
      this.setState({
        data: postList,
        loading: false
      })
    })
  }
  renderCard(postObj) {
    console.log(postObj)
    if(postObj) {
      let pic = {uri: this.host + postObj.photo}
      let text = postObj.country;
      console.log(pic)
      return (
        <View>
          <Image style={{height: 200, width: 200, flex: 1}} source={pic}/>
          <Text>{text}</Text>
        </View>
      )
    }
    return null;
  }
  renderNoMoreCards() {
    return (
      <Card>
        <CardItem cardBody>
          <Text style={styles.text}> Out of Matches </Text>
        </CardItem>
      </Card>
    )
  }
  render() {
    return (
      <View>
        { this.state.loading ? <Spinner/> :
          <List>
            <FlatList
              style={{height: 940}}
              data={this.state.data}
              renderItem={({item}) => this.renderCard(item)}
              keyExtractor={(item) => item.id}
            />
          </List>
        }
      </View>
    )
  }
}
const styles = StyleSheet.create({
  text: {
    color: 'black',
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10
  },
  thumbnail: {
    width: 300,
    height: 300,
    flex: 1
  }
})
