import React from 'react';
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements'

import Login from '../screens/Login';
// import HomePage from '../screens/HomePage'
import DealDetails from '../screens/DealDetails';
import StoreProfile from '../screens/StoreProfile';

import Colors from '../constants/Colors';

// import MainTabNavigator from './MainTabNavigator';

const App = createStackNavigator(
  { 
    // Home: HomePage,
    DealDetails: DealDetails,
    StoreProfile: StoreProfile,
  },
  {
    initialRouteName: 'DealDetails',
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      headerStyle: {
          backgroundColor: '#325340',
      },
      headerTintColor: Colors.tintColor,
      headerTitleStyle: {
          fontWeight: 'bold',
      },
      headerRight: <Icon name='info-circle' type='font-awesome' color='white' />,
      headerRightContainerStyle: {marginRight: 15},
    },
  }
);
// const AuthStack = createStackNavigator({ Login: Login, });

const AppNavigator = createSwitchNavigator(
  {
    Loading: Loading,
    Login: Login,
    App: App,
  },
  {
    initialRouteName: 'Login',
  }
);

export default createAppContainer(AppNavigator);
  // createSwitchNavigator({
  //   // You could add another route here for authentication.
  //   // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  //   Main: MainTabNavigator,
  // })
