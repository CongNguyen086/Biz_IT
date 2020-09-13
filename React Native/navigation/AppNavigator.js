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
import ConnectScreen from '../screens/ConnectScreen';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import ContactListScreen from '../screens/ContactList';

const tabBarOptions = {
  activeTintColor: Colors.primary,
  inactiveTintColor: Colors.tabIconDefault,
  style: {
    paddingTop: 5
  },
  labelStyle: {
    marginTop: 2,
  }
}

const HomeStack = createStackNavigator(
  {
    Home: HomePage,
  }
);

HomeStack.navigationOptions = {
  header: null,
  tabBarLabel: 'Ưu Đãi',
  tabBarIcon: ({ focused }) => (
    <Ionicons name='ios-gift' size={28} color={focused ? Colors.primary : Colors.tabIconDefault} />
  ),
  tabBarOptions
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
    <MaterialCommunityIcons name='map-marker-radius' size={30} color={focused ? Colors.primary : Colors.tabIconDefault} />
  ),
  tabBarOptions
};

const ConnectStack = createStackNavigator(
  {
    Connect: ConnectScreen,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#325340',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        textAlign: 'center',
      },
    },
  }
);

ConnectStack.navigationOptions = {
  tabBarLabel: 'Kết nối',
  tabBarIcon: ({ focused }) => (
    <Ionicons name='ios-people' size={35} color={focused ? Colors.primary : Colors.tabIconDefault} />
  ),
  tabBarOptions
};

const WalletStack = createStackNavigator(
  {
    Home: HomePage,
  }
);

WalletStack.navigationOptions = {
  tabBarLabel: 'Ví Của Tôi',
  tabBarIcon: (<Image  style={{width: 25, height: 25}} source={require('../assets/icons/my_wallet.png')} />),
  tabBarOptions
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
  },
}
);

const App = createStackNavigator(
  {
    HomePage: TabNavigator,
    DealDetails: DealDetails,
    StoreProfile: StoreProfile,
    Payment: PaymentScreen,
    AfterPayment: AfterPaymentScreen,
    Connect: ConnectScreen,
    ContactList: ContactListScreen
  },
  {
    // initialRouteName: 'HomePage',
    initialRouteName: 'ContactList',
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
    initialRouteName: 'App',
  }
);

export default createAppContainer(AppNavigator);
