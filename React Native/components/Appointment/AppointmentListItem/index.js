import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Colors from '../../../constants/Colors'
import Appointment from '../../../services/app/Appointment'
import _ from 'lodash'

const tagStyleGenerator = status => {
  const style = {
    backgroundColor: '#000',
  }
  switch(status) {
    case Appointment.Status.CANCELED:
    case Appointment.Status.DECLINED:
      style.backgroundColor = Colors.declined;
      break;
    case Appointment.Status.COMPLETED:
    case Appointment.Status.SELECTED:
      style.backgroundColor = Colors.completed;
      break;
    case Appointment.Status.WAITING:
      style.backgroundColor = Colors.waiting;
      break;
  }

  return style;
}

export default function AppointmentListItem(
  {
    appointment: {
      eventName,
      type,
      status,
      meetingDate,
      hostId,
      hostName,
      votedNumber,
      selectedNumber,
      invitedNumber,
    } = {},
    onPress = () => {}
  }
  ) {
  
  const dateText = useMemo(() => {
    meetingDate = new Date(meetingDate);
    const current = new Date();
    const begin = new Date(current);
    begin.setHours(0,0,0,0);
    const end = new Date(current);
    end.setHours(23,59,59,999);
    if (meetingDate >= begin && meetingDate <= end) {
      return 'Today';
    }
    if (meetingDate >= new Date(begin.getTime() + 86400 * 1000) && meetingDate <= new Date(end.getTime() + 86400 * 1000)) {
      return 'Tomorrow';
    }

    let [date, month, year, hours, minutes] = [
      meetingDate.getDate() + 1,
      meetingDate.getMonth() + 1,
      meetingDate.getFullYear(),
      meetingDate.getHours(),
      meetingDate.getMinutes(),
    ]

    date = date < 10 ? `0${date}` : date;
    month = month < 10 ? `0${month}` : month;
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${date}/${month}/${year} ${hours}:${minutes}`
  }, [meetingDate])

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.meetingMessage}>{eventName}</Text>
        <View style={styles.statusBtnsWrapper}>
          {type === Appointment.Type.SENT && (
            <React.Fragment>
              <TouchableOpacity style={styles.statusButton} >
                <Text style={[styles.statusButtonText, styles.statusButtonText_Completed]}>Complete</Text>
              </TouchableOpacity>
              <View style={styles.statusDivider} />
              <TouchableOpacity style={styles.statusButton} >
                <Text style={[styles.statusButtonText, styles.statusButtonText_Declined]}>Cancel</Text>
              </TouchableOpacity>
              <View style={styles.statusDivider} />
            </React.Fragment>
          )}
          <TouchableOpacity style={styles.statusButton} >
            <Text style={[styles.statusButtonText, styles.statusButtonText_Details]}>Detail</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={[styles.row, styles.rowSpaceTop]}>
        <View style={styles.row}>
          <Icon 
            type='material' 
            name={type === Appointment.Type.SENT ? 'call-made' : 'call-received'} 
            size={18} color={type === Appointment.Type.SENT ? Colors.waiting : Colors.completed} 
          />
          <Text style={styles.meetingDate}>{dateText}</Text>
        </View>
        <Text 
          style={[
            styles.rightText, 
            type === Appointment.Type.RECEIVED && {fontStyle: 'italic'}
          ]}
        >
          {type === Appointment.Type.RECEIVED ? hostName : `${selectedNumber}/${invitedNumber} accepted`}
        </Text>
      </View>

      <View style={[styles.row, styles.rowSpaceTop]}>
        <View style={[styles.tag, tagStyleGenerator(status)]}>
          <Text style={styles.tagText}>{_.upperFirst(_.lowerCase(status))}</Text>
        </View>
        <Text 
          style={[
            styles.rightText,
            votedNumber === invitedNumber && {color: Colors.completed}
          ]}
        >
          {`${votedNumber}/${invitedNumber} voted`}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rowSpaceTop: {
    marginTop: 10,
  },
  meetingMessage: {
    fontWeight: '700',
    color: '#000',
    fontSize: 16,
    paddingRight: 15,
    width: '50%',
  },
  statusBtnsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusButton: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusButtonText: {
    fontWeight: '600',
  },
  statusButtonText_Completed: {
    color: Colors.completed,
  },
  statusButtonText_Declined: {
    color: Colors.declined,
  },
  statusButtonText_Details: {
    color: Colors.primary,
  },
  statusDivider: {
    minHeight: 20,
    width: 1,
    backgroundColor: Colors.secondary,
  },
  meetingDate: {
    marginLeft: 5,
    color: Colors.secondary
  },
  rightText: {
    color: Colors.secondary
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: Colors.waiting
  },
  tagText: {
    color: '#fff',
    fontWeight: '400',
  }
})
