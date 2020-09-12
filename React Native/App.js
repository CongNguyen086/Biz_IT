import {Provider} from 'react-redux'
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import AppNavigator from './navigation/AppNavigator';
import { MenuProvider } from 'react-native-popup-menu';
import store from './store';
import AppNavigation from './services/navigation';

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <MenuProvider>
            <View style={styles.container}>
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <AppNavigator ref={AppNavigation.setNavigationRef} />
            </View>
          </MenuProvider>
        </SafeAreaProvider>
      </Provider>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/icons/robot-dev.png'),
      require('./assets/icons/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
