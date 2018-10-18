import React from 'react';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import SplashScreen from './screens/splash.screen';
import PostScreen from './screens/post.screen';
import QuestionScreen from './screens/question.screen';
import MatchScreen from './screens/match.screen';
import {
  Button,
  Icon
} from 'native-base';

const MenuButton = ({navigate}) => (
  <Button transparent
    onPress={() => {
      navigate('DrawerOpen')
    }}>
    <Icon style={{color: "#fff"}} size={28} name="menu"/>
  </Button>
)
const Splash = {
  screen: SplashScreen,
  navigationOptions: {
    header: null
  }
}
const Post = {
  screen: PostScreen,
  navigationOptions: {
    headerMode: 'screen',
    headerTitle: 'Post',
    drawerLabel: 'Post'
  }
}
const Question = {
  screen: QuestionScreen,
  navigationOptions: {
    headerMode: 'screen',
    headerTitle: 'Question'
  }
}
const Match = {
  screen: MatchScreen,
  navigationOptions: {
    headerMode: 'screen',
    headerTitle: 'Match'
  }
}
const PostStack = StackNavigator({
  Post: Post,
  Question: Question,
  Match: Match
}, {
  navigationOptions: ({navigation, HeaderProps}) => ({
    headerLeft: <MenuButton navigate={navigation.navigate}/>,
    headerStyle: { backgroundColor: "#000"},
    headerTintColor: "#fff"
  })
})
const RouteConfig = {
  initialRoute: 'Splash'
}
const AppNavigator = DrawerNavigator({
  Splash: Splash,
  Post: {screen: PostStack}
}, RouteConfig)

export default AppNavigator;
