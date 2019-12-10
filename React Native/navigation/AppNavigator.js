import React from 'react';
import { Image } from 'react-native';
import { createAppContainer, createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements'

import Login from '../screens/Login';
import HomePage from '../screens/HomePage';
import Loading from '../screens/Loading';
import MapStore from '../screens/MapStore'
import DealDetails from '../screens/DealDetails';
import StoreProfile from '../screens/StoreProfile';
import PaymentScreen from '../screens/PaymentScreen';
import AfterPaymentScreen from '../screens/AfterPaymentScreen';
import SendCodeScreen from '../screens/SendCodeScreen';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
  tabBarIcon: ({ focused }) => (
    <Ionicons name='ios-gift' size={28} color={focused ? Colors.momoColor : Colors.tabIconDefault} />
  ),
  tabBarOptions: {
    activeTintColor: Colors.momoColor,
    inactiveTintColor: Colors.tabIconDefault,
  },
};

const MapStack = createStackNavigator(
  {
    Meeting: MapStore,
  }
);

MapStack.navigationOptions = {
  header: null,
  tabBarLabel: 'Điểm Hẹn',
  tabBarIcon: ({ focused }) => (
    <MaterialCommunityIcons name='map-marker-radius' size={30} color={focused ? Colors.momoColor : Colors.tabIconDefault} />
  ),
  tabBarOptions: {
    activeTintColor: Colors.momoColor,
    inactiveTintColor: Colors.tabIconDefault,
  },
};

const ConnectStack = createStackNavigator(
  {
    Connect: HomePage,
  }
);

ConnectStack.navigationOptions = {
  tabBarLabel: 'Kết nối',
  tabBarIcon: ({ focused }) => (
    <Ionicons name='ios-people' size={35} color={focused ? Colors.momoColor : Colors.tabIconDefault} />
  ),
  tabBarOptions: {
    activeTintColor: Colors.momoColor,
    inactiveTintColor: Colors.tabIconDefault,
  },
};

const WalletStack = createStackNavigator(
  {
    Home: HomePage,
  }
);

WalletStack.navigationOptions = {
  tabBarLabel: 'Ví Của Tôi',
  tabBarIcon: (<Image  style={{width: 25, height: 25}} source={require('../assets/icons/my_wallet.png')} />),
  tabBarOptions: {
    activeTintColor: Colors.momoColor,
    inactiveTintColor: 'gray',
  },
};

const TabNavigator = createBottomTabNavigator({
  HomeStack,
  MapStack,
  ConnectStack,
  WalletStack,
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
  },
  {
    // initialRouteName: 'HomePage',
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
