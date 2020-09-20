import React from 'react'
import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import PendingAppointment from '../components/Appointment/PendingAppointment';
import HeaderTitle from '../components/HeaderTitle';

class Appointment extends React.Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#EDEEEE',}}>
        <View style={styles.container}>
          <View style={styles.navigationBar} />
          <View style={styles.card}>
            <PendingAppointment />
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

Appointment.navigationOptions = {
  header: null,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  navigationBar: {
    backgroundColor: 'red',
    minHeight: 50,
    marginBottom: 25,
  },  
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 3,
  }
})

export default Appointment;
