import React from 'react';
import { createAppContainer, createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';

import Login from '../screens/Login';
import Register from '../screens/Register';
import HomePage from '../screens/HomePage';
import Loading from '../screens/Loading';
import MapStore from '../screens/MapStore'
import DealDetails from '../screens/DealDetails';
import StoreProfile from '../screens/StoreProfile';
import PaymentScreen from '../screens/PaymentScreen';
import AfterPaymentScreen from '../screens/AfterPaymentScreen';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import ContactListScreen from '../screens/ContactList';
import AppointmentScreen from '../screens/AppointmentScreen';
import HeaderTitle from '../components/HeaderTitle';
import AppointmentDetail from '../screens/AppointmentDetail';
import Profile from '../screens/ProfileScreen';

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
    Home: {
      screen: HomePage,
    }
  }
);

HomeStack.navigationOptions = {
  header: null,
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <Ionicons name='ios-home' size={30} color={focused ? Colors.primary : Colors.tabIconDefault} />
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
  tabBarLabel: 'Map',
  tabBarIcon: ({ focused }) => (
    <MaterialCommunityIcons name='map-marker-radius' size={30} color={focused ? Colors.primary : Colors.tabIconDefault} />
  ),
  tabBarOptions
};

const AppointmentStack = createStackNavigator(
  {
    Appointment: {
      screen: AppointmentScreen,
      navigationOptions: {
        // title: "Appointment",
        headerTitle: <HeaderTitle title='Profile' />,
        headerStyle: {
          backgroundColor: Colors.primary
        }
      }
    },
  },
);

AppointmentStack.navigationOptions = {
  tabBarLabel: 'Appointment',
  tabBarIcon: ({ focused }) => (
    <Ionicons name='ios-calendar' size={30} color={focused ? Colors.primary : Colors.tabIconDefault} />
  ),
  tabBarOptions
};

const ProfileStack = createStackNavigator(
  {
    Profile: {
      screen: Profile,
      navigationOptions: {
        // title: "Appointment",
        headerTitle: <HeaderTitle title='Profile' />,
        headerStyle: {
          backgroundColor: Colors.primary
        }
      }
    },
  }
);

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  // tabBarIcon: (<Image  style={{width: 25, height: 25}} source={require('../assets/icons/my_wallet.png')} />),
  tabBarIcon: ({ focused }) => (
    <Ionicons name='ios-person' size={30} color={focused ? Colors.primary : Colors.tabIconDefault} />
  ),
  tabBarOptions
};

const TabNavigator = createBottomTabNavigator({
  HomeStack,
  MapStack,
  AppointmentStack,
  ProfileStack,
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
    ContactList: ContactListScreen,
    AppointmentDetail: AppointmentDetail,
  },
  {
    initialRouteName: 'HomePage',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Colors.primary,
      },
      headerTintColor: Colors.tintColor,
      headerTitleStyle: {
        fontWeight: '500',
      },
    },
  }
);

const AppNavigator = createSwitchNavigator(
  {
    Loading: Loading,
    Login: Login,
    Register: Register,
    App: App,
  },
  {
    initialRouteName: 'Login',
  }
);

export default createAppContainer(AppNavigator);
