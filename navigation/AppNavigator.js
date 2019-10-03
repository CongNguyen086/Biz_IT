import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import DealDetails from '../screens/DealDetails';
import StoreProfile from '../screens/StoreProfile';
import Colors from '../constants/Colors';
import { Icon } from 'react-native-elements'
// import MainTabNavigator from './MainTabNavigator';

const AppNavigator = createStackNavigator(
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

export default createAppContainer(AppNavigator);
  // createSwitchNavigator({
  //   // You could add another route here for authentication.
  //   // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  //   Main: MainTabNavigator,
  // })
