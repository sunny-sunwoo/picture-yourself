import React, { Component } from 'react';
import {
  Container,
  Content,
  Icon,
  Button,
  Form,
  Text,
  Input,
  Card,
  CardItem,
  Spinner
} from 'native-base';
import { Image } from 'react-native';
import { inject } from 'mobx-react';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';

import ImagePicker from 'react-native-image-picker';

const options = {
  title: 'Select Image',
  quality: 1.0,
  storageOptions: {
    skipBackup: true,
    path: 'image'
  }
}

@inject("stores")
@observer
export default class PostScreen extends Component {
  @observable image = null;
  @observable uploading = false;
  @observable data = null;

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    ImagePicker.showImagePicker(options, (res) => {
      this.image = {uri: res.uri}
      this.data = res
      console.log(res)
    })
  }
  post() {
    const { posts } = this.props.stores;
    const { navigation } = this.props;
    this.uploading = true;
    posts.postImage(this.data, () => {
      console.log('postImageComplete')
      this.uploading = false;
      navigation.navigate("Question")
    })
  }
  render() {
    return (
      <Container>
        <Content style={{backgroundColor: "#858585"}}>
          {this.uploading ? <Spinner/> : null}
          <Card>
            <CardItem cardBody>
              {this.image ? <Image style={{height:880, width: null, flex: 1}} source={this.image} /> : null}
            </CardItem>
            <CardItem>
              <Button rounded block
                onPress={this.post.bind(this)}>
                <Text>Share!</Text>
              </Button>
            </CardItem>
          </Card>
        </Content>
      </Container>
    )
  }
}
