import React, {useEffect, useState } from 'react'
import {View, LayoutAnimation, ActivityIndicator, Text } from 'react-native'
import {useSafeArea} from 'react-native-safe-area-context'
import { withNavigation } from 'react-navigation'
import HeaderTitle from '../../components/HeaderTitle'
import Colors from '../../constants/Colors'
import AppRepo from '../../services/app/repo'
import AppointmentDetail from './AppointmentDetail'
import styles from './styles'

function AppointmentDetailWrapper({ navigation }) {
  const insets = useSafeArea()
  const [appointmentData, setAppointmentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const appointmentId = navigation.getParam('appointmentId');
    setLoading(true);
    AppRepo.getAppointmentDetail({appointmentId})
      .then(data => setAppointmentData(data))
      .catch(e => console.log(e))
      .finally(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
        setLoading(false)
      })
  }, [navigation])

  return (
    <View style={[styles.safeView, { paddingLeft: insets.left, paddingRight: insets.right}]}>
      {loading && (
        <View style={[styles.container, {justifyContent: 'center',alignItems: 'center'}]}>
          <ActivityIndicator size='large' color={Colors.primary} />
        </View>
      )}
      {!loading && appointmentData && (
        <AppointmentDetail 
          appointmentData={appointmentData} 
          setAppointmentData={setAppointmentData}
        />
      )}
      {!loading && !appointmentData && (
        <Text>Something when wrong!</Text>
      )}
    </View>
  )
}

AppointmentDetailWrapper.navigationOptions = {
  headerTitle: <HeaderTitle title='Appointment detail' />
}

export default withNavigation(AppointmentDetailWrapper);
