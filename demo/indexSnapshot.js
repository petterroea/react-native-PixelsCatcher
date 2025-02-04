/* @flow */
import React from 'react';
import {
  Platform,
  Text,
  View,
  WebView,
  YellowBox,
} from 'react-native';
import {
  registerSnapshot,
  runSnapshots,
  Snapshot,
} from 'pixels-catcher';

import App from './src/App';
import { name as appName } from './app.json';

const baseUrl = Platform.select({ // Put real IP of your server to run on real device
  android: 'http://10.0.2.2:3000',
  ios: 'http://127.0.0.1:3000',
});

registerSnapshot(class SnapshotClass extends Snapshot {
  static snapshotName = 'AppSnapshot';

  renderContent() {
    return (
      <App />
    );
  }
});

registerSnapshot(class SnapshotClass extends Snapshot {
  static snapshotName = 'AppSnapshotWithWrongRefImg';

  renderContent() {
    return (
      <App />
    );
  }
});

registerSnapshot(class SnapshotClass extends Snapshot {
  static snapshotName = 'someComponent';

  renderContent() {
    return (
      <View><Text>Some component</Text></View>
    );
  }
});

// Disable warning fot the test
YellowBox.ignoreWarnings(['Warning: WebView has been extracted']);

registerSnapshot(class SnapshotClass extends Snapshot {
  static snapshotName = 'WebViewTest';

  componentDidMount() {
    // override default componentDidMount from Snapshot to delay it
    // until WebView is loaded. onLoad from WebView is used
  }

  renderContent() {
    return (
      <WebView
        source={{uri: 'https://github.com/rumax/react-native-PixelsCatcher'}}
        style={{ flex: 1, marginTop: 20 }}
        onLoad={() => {
          this.props.onReady();
        }} />
    );
  }
});

runSnapshots(appName, { baseUrl });
