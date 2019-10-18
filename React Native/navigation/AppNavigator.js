import React from 'react';
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements'

import Login from '../screens/Login';
import HomePage from '../screens/HomePage';
import Loading from '../screens/Loading';
import DealDetails from '../screens/DealDetails';
import StoreProfile from '../screens/StoreProfile';
import PaymentScreen from '../screens/PaymentScreen';
import AfterPaymentScreen from '../screens/AfterPaymentScreen';
import SendCodeScreen from '../screens/SendCodeScreen';

import Colors from '../constants/Colors';

// import MainTabNavigator from './MainTabNavigator';

const App = createStackNavigator(
  { 
    Home: HomePage,
    DealDetails: DealDetails,
    StoreProfile: StoreProfile,
    Payment: PaymentScreen,
    AfterPayment: AfterPaymentScreen,
    SendCode: SendCodeScreen,
  },
  {
    initialRouteName: 'Home',
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
