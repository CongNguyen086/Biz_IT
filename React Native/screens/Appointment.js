import React, { Component } from 'react'
import { Text, View } from 'react-native'
import HeaderTitle from '../components/HeaderTitle';

class Appointment extends Component {

  static navigationOptions = {
    headerTitle: <HeaderTitle title='Appointment' />,
  };

  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    )
  }
}

export default Appointment;
