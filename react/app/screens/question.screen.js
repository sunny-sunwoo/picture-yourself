import React, { Component } from 'react'
import {
  Container,
  Content,
  Icon,
  Item,
  Button,
  Form,
  Text,
  Input,
  Card,
  CardItem,
  Spinner
} from 'native-base';
import { Image, StyleSheet } from 'react-native';
import { inject } from 'mobx-react';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';

@inject("stores")
@observer
export default class QuestionScreen extends Component {
  @observable text = '';
  @observable uploading = false;

  constructor(props) {
    super(props)
  }
  post() {
    const { posts } = this.props.stores;
    const { navigation } = this.props;
    this.uploading = true;
    console.log('uploading')
    posts.answerQuestion(this.text, (ok) => {
      console.log('answerQuestionComplete ' + ok)
      if (ok == 1) {
        navigation.navigate("Match")
      }
      this.uploading = false;
    })
  }
  render() {
    return (
      <Container>
        <Content style={{backgroundColor: "#858585"}}>
          {this.uploading ? <Spinner/> : null}
          <Card>
            <CardItem>
              <Form>
                <Text style={styles.text}>
                  Where are you from?
                </Text>
                <Item borderType='underline'>
                  <Input style={{color: 'black'}}
                    placeholderTextColor='black'
                    placeholder='Enter Country Name'
                    onChangeText={(text) => this.text = text}/>
                </Item>
                <Button rounded block
                  onPress={this.post.bind(this)}>
                  <Text>Share!</Text>
                </Button>
              </Form>
            </CardItem>
          </Card>
        </Content>
      </Container>
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
