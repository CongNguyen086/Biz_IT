import { FontAwesome } from '@expo/vector-icons';
import React, { useCallback } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DatePicker from 'react-native-datepicker';
import Colors from '../../../constants/Colors';
import Appointment from '../../../services/app/Appointment';
import AppointmentListItem from '../AppointmentListItem';

const appointmentList = [
  {
    eventName: 'party',
    type: "received",
    status: 'selected',
    date: new Date(),
    hostId: '',
    hostName: "Nguyen Mon",
    votedNumber: 2,
    acceptedNumber: 2,
    numberOfUsers: 3,
  },
  {
    eventName: 'party 2',
    type: "sent",
    status: 'waiting',
    date: new Date(Date.now() + 24*2*60*60*1000),
    hostId: '',
    hostName: "Hieu Do",
    votedNumber: 3,
    acceptedNumber: 2,
    numberOfUsers: 3,
  },
]

export default function AppointmentList() {
  const renderAppointmentItem = useCallback((item) => {
    return <AppointmentListItem appointment={Appointment.object(item)} />
  }, [])
  return (
    <View style={{flex: 1,}}>
      <View>
        <Text 
          style={{
            fontSize: 18,
            color: '#4E5A69',
          }}
        >
          Appointment date
        </Text>
        <View style={styles.dateContainer}>
          <DatePicker 
            customStyles={{
              dateTouchBody: {
                padding: 0,
              },
              dateInput: {
                borderRadius: 5,
                borderColor: '#ccc',
                height: 30,
              },
              dateIcon: {
                width: 0,
                height: 0,
              }
            }}
            iconSource={null}
            style={{
              width: 100,
            }}
          />
          <TouchableOpacity style={styles.appointmentButton}>
            <Text style={styles.appointmentButtonText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.appointmentButton}>
            <Text style={styles.appointmentButtonText}>Tomorrow</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.appointmentButton, styles.filterButton, styles.filterButtonActive]}>
            <FontAwesome name='filter' size={14} color='#fff' style={{marginRight: 5}} />
            <Text style={[styles.appointmentButtonText, styles.appointmentButtonTextActive]}>Filter</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.dateContainer, styles.filterSection]}>
        {/* type & status */}
        <View style={styles.filterItem}>
          <Text style={[styles.textGrey, {marginRight: 10}]}>Type</Text>
          <TouchableOpacity style={[styles.appointmentButton, styles.buttonClear, {marginLeft: 0,}]}>
            <Text style={[styles.appointmentButtonText, styles.buttonClearText]}>Sent</Text>
            <FontAwesome name='sort-desc' size={14} color='#000' style={{marginLeft: 5, paddingBottom: 5,}} />
          </TouchableOpacity>
        </View>
        <View style={[styles.filterItem, {marginLeft: 35,}]}>
          <Text style={[styles.textGrey, {marginRight: 10}]}>Status</Text>
          <TouchableOpacity style={[styles.appointmentButton, styles.buttonClear, {marginLeft: 0,}]}>
            <Text style={[styles.appointmentButtonText, styles.buttonClearText]}>Done</Text>
            <FontAwesome name='sort-desc' size={14} color='#000' style={{marginLeft: 5, paddingBottom: 5,}} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.filterList}>
        {/* filter */}
        <TouchableOpacity style={styles.filterTag}>
            <Text style={styles.filterTagText}>siflte</Text>
            <FontAwesome name='times' size={16} color='#4E5A69' />
        </TouchableOpacity>
      </View>
      <FlatList
        data={appointmentList}
        renderItem={({item}) => renderAppointmentItem(item)}
        style={{flex: 1}}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  dateContainer: {
    // width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  appointmentButton: {
    backgroundColor: '#C4C4C4',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    minHeight: 30,
    marginLeft: 15,
  },
  appointmentButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  appointmentButtonTextActive: {
    fontWeight: '700'
  },
  filterButton: {
    backgroundColor: 'transparent'
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  textGrey: {
    color: '#4E5A69',
    fontSize: 16,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  filterSection: {
    paddingBottom: 15,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  buttonClear: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  buttonClearText: {
    color: '#4E5A69'
  },
  filterList: {
    marginTop: 20, 
    paddingBottom: 15, 
    borderBottomColor: '#ccc', 
    borderBottomWidth: 1, 
    flexDirection: 'row', 
    flexWrap: 'wrap'
  },
  filterTag: {
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  filterTagText: {
    color: '#4E5A69',
    fontSize: 16,
    marginRight: 10,
  }
})
