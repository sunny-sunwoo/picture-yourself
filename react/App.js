/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import AppNavigator from './app/app.navigator';
import RootStore from './app/stores/root.store';
import {
  StyleProvider
} from 'native-base';
import getTheme from './native-base-theme/components';
import custom from './native-base-theme/variables/custom';
import Amplify, { Storage } from 'aws-amplify';
import aws_exports from './aws-exports';
Amplify.configure(aws_exports);
Storage.configure({ level: 'public' });

export default class App extends Component<{}> {
  render() {
    return (
      <Provider stores={new RootStore()}>
        <StyleProvider style={getTheme(custom)}>
          <AppNavigator/>
        </StyleProvider>
      </Provider>
    );
  }
}
