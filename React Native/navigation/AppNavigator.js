import React from 'react';
import { Image } from 'react-native';
import { createAppContainer, createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements'

import Login from '../screens/Login';
import HomePage from '../screens/HomePage';
import Loading from '../screens/Loading';
import DealDetails from '../screens/DealDetails';
import StoreProfile from '../screens/StoreProfile';
import PaymentScreen from '../screens/PaymentScreen';
import AfterPaymentScreen from '../screens/AfterPaymentScreen';
import SendCodeScreen from '../screens/SendCodeScreen';
import { Ionicons } from '@expo/vector-icons';
import TabBarIcon from '../components/TabBarIcon';

import Colors from '../constants/Colors';

// import MainTabNavigator from './MainTabNavigator';

const HomeStack = createStackNavigator(
  {
    Home: HomePage,
  }
);

HomeStack.navigationOptions = {
  header: null,
  tabBarLabel: 'Ưu Đãi',
  tabBarIcon: (<Image  style={{width: 25, height: 25}} source={require('../assets/icons/deal.png')} />),
  tabBarOptions: {
    activeTintColor: '#AE2027',
    inactiveTintColor: 'gray',
  },
};

const HistoryStack = createStackNavigator(
  {
    Home: HomePage,
  }
);

HistoryStack.navigationOptions = {
  tabBarLabel: 'Lịch sử GD',
  tabBarIcon: (<Image  style={{width: 25, height: 25}} source={require('../assets/icons/history.png')} />),
  tabBarOptions: {
    activeTintColor: '#AE2027',
    inactiveTintColor: 'gray',
  },
};

const WalletStack = createStackNavigator(
  {
    Home: HomePage,
  }
);

WalletStack.navigationOptions = {
  tabBarLabel: 'Ví Của Tôi',
  tabBarIcon: (<Image  style={{width: 25, height: 25}} source={require('../assets/icons/wallet.png')} />),
  tabBarOptions: {
    activeTintColor: '#AE2027',
    inactiveTintColor: 'gray',
  },
};

const TabNavigator = createBottomTabNavigator({
  HomeStack,
  HistoryStack,
  WalletStack
},
{
  navigationOptions: {
    header: null
  }
}
);

const App = createStackNavigator(
  {
    HomePage: TabNavigator,
    DealDetails: DealDetails,
    StoreProfile: StoreProfile,
    Payment: PaymentScreen,
    AfterPayment: AfterPaymentScreen,
    SendCode: SendCodeScreen,
  },
  {
    initialRouteName: 'HomePage',
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
      headerRightContainerStyle: { marginRight: 15 },
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
