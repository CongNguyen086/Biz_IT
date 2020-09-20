import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, Dimensions } from 'react-native'
import {TabView, SceneMap, TabBar, TabBarItem} from 'react-native-tab-view';
import AppointmentList from '../components/Appointment/AppointmentList';
import PendingAppointment from '../components/Appointment/PendingAppointment';
import HeaderTitle from '../components/HeaderTitle';
import Colors from '../constants/Colors';

const AppointmentListScreen = () => (
  <View style={styles.card}>
    <AppointmentList />
  </View>
);

const PendingAppointmentScreen = () => {
  return (
    <View style={styles.card}>
      <PendingAppointment />
    </View>
  )
};

const initialLayout = { width: Dimensions.get('window').width };

class Appointment extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      screenIndex: 0,
      routes: [
        { key: 'appointment_list', title: 'Appointment list' },
        { key: 'pending_appointment', title: 'Pending appointment' },
      ]
    }
  }

  setIndex = index => {
    this.setState({
      screenIndex: index,
    })
  }

  renderTabBarItem = props => {
    const currentRoute = props.route.key;
    const activeRoute = props.navigationState.routes[props.navigationState.index].key;
    const isActive = currentRoute === activeRoute;
  
    return (
      <TabBarItem
        {...props}
        style={[styles.activeTab, isActive && {backgroundColor: '#fff'}]}
      />
    )
  }

  renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        renderTabBarItem={this.renderTabBarItem}
        renderLabel={({ route, focused }) => {
          const color = focused ? Colors.primary : '#fff';
          return (
            <Text style={{ color, fontSize: 16, fontWeight: '600' }}>
              {route.title}
            </Text>
          )
        }}
        style={styles.tabBarContainer}
        renderIndicator={() => null}
      />
    )
  }

  render() {
    const renderScene = SceneMap({
      appointment_list: AppointmentListScreen,
      pending_appointment: PendingAppointmentScreen,
    });
    const {routes, screenIndex} = this.state;
    const {setIndex, renderTabBar} = this;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#EDEEEE',}}>
        <View style={styles.container}>
          <TabView
            navigationState={{ index: screenIndex, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            sceneContainerStyle={{
              paddingTop: 20,
            }}
            renderTabBar={renderTabBar}
          />
        </View>
      </SafeAreaView>
    )
  }
}

Appointment.navigationOptions = {
  headerTitle: <HeaderTitle title='Appointment' />,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 3,
  },
  tabBarContainer: {
    backgroundColor: '#C4C4C4',
    borderRadius: 20,
  },
  activeTab: {
    borderRadius: 20,
    backgroundColor: 'transparent',
    margin: 2,
    minHeight: 40,
  }
})

export default Appointment;
