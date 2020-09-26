import { FontAwesome } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DatePicker from 'react-native-datepicker';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import _ from 'lodash';
import Colors from '../../../constants/Colors';
import Appointment from '../../../services/app/Appointment';
import AppointmentListItem from '../AppointmentListItem';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointmentList } from '../../../services/app/getters';
import NoContent from '../../NoContent';
import { FETCH_APPOINTMENTS } from '../../../services/app/constants';
import { withNavigation } from 'react-navigation';

const FILTER_OPTIONS = {
  DATE: 'DATE',
  STATUS: 'STATUS',
  TYPE: 'TYPE',
}

const FILTER_BY_ALL = 'all'

function checkTodayOrTomorrow(date) {
  const meetingDate = new Date(date);
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
  return 'Other'
}

function isInDate(date, compareWithDate = new Date()) {
  return (
    date.getFullYear() === compareWithDate.getFullYear()
    && date.getMonth() === compareWithDate.getMonth()
    && date.getDate() === compareWithDate.getDate()
  )
}

function AppointmentList({navigation}) {
  const dispatch = useDispatch();
  const {appointmentList, appointmentLoading} = useSelector(getAppointmentList);
  const [filterShown, setShowFilter] = useState(false);
  const [filterMeetingDate, setFilterMeetingDate] = useState(new Date());
  const [filterByStatus, setFilterStatus] = useState(FILTER_BY_ALL);
  const [filterByType, setFilterType] = useState(FILTER_BY_ALL);

  const isToday = useMemo(() => checkTodayOrTomorrow(filterMeetingDate) === 'Today');

  const filteredAppointmentList = useMemo(() => {
    let res = [...appointmentList];
    res = res.filter(ap => !(ap.status === Appointment.Status.DECLINED || ap.eventStatus === Appointment.Status.CANCELED))
    if (filterMeetingDate) {
      res = res.filter(ap => isInDate(ap.meetingDate, filterMeetingDate));
    }
    if (filterShown) {
      // res = res.filter(ap => ap.status === filterByStatus && ap.type === filterByType);
      if (filterByStatus !== FILTER_BY_ALL) {
        res = res.filter(ap => ap.eventStatus === filterByStatus)
      }
      if (filterByType !== FILTER_BY_ALL) {
        res = res.filter(ap => ap.type === filterByType)
      }
    }
    return res;
  }, [appointmentList, filterShown, filterMeetingDate, filterByStatus, filterByType])

  const onTodayPress = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    if (filterMeetingDate) {
      setFilterMeetingDate(null)
    } else {
      setFilterMeetingDate(new Date());
    }
  }, [filterMeetingDate])

  const renderAppointmentItem = useCallback((item) => {
    return <AppointmentListItem appointment={item} onPress={() => onAppointmentPress(item.id)} />
  }, [])

  const toggleFilter = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowFilter(!filterShown)
  }, [filterShown])

  const onFilterDateChanged = useCallback((date) => {
    setFilterMeetingDate(new Date(date))
  }, [])

  const onFilterByTypeChanged = useCallback((data) => {
    setFilterType(data)
  }, [])

  const onFilterByStatusChanged = useCallback((data) => {
    setFilterStatus(data)
  }, [])

  const dateText = useMemo(() => {
    const meetingDate = new Date(filterMeetingDate);
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

    let [date, month, year] = [
      meetingDate.getDate() ,
      meetingDate.getMonth() + 1,
      meetingDate.getFullYear(),
    ]

    date = date < 10 ? `0${date}` : date;
    month = month < 10 ? `0${month}` : month;

    return `${date}/${month}/${year}`
  }, [filterMeetingDate])

  const onRemoveFilter = useCallback((option) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    switch(option) {
      case FILTER_OPTIONS.DATE:
        setFilterMeetingDate(null)
        break;
      case FILTER_OPTIONS.STATUS:
        setFilterStatus(FILTER_BY_ALL)
        break;
      case FILTER_OPTIONS.TYPE:
        setFilterType(FILTER_BY_ALL)
        break;
    }
  }, [])

  const onAppointmentPress = useCallback((appointmentId) => {
    navigation.navigate('AppointmentDetail', { appointmentId });
  }, [navigation])

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    if (!filterShown) {
      setFilterStatus(null)
      setFilterType(null)
    } else {
      setFilterStatus(FILTER_BY_ALL)
      setFilterType(FILTER_BY_ALL)
    }
  }, [filterShown])

  useEffect(() => {
    dispatch({
      type: FETCH_APPOINTMENTS
    })
  }, [dispatch])

  if (!appointmentLoading && (!appointmentList || appointmentList.length === 0)) {
    return <NoContent />
  }

  if (appointmentLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    )
  }

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
          <TouchableOpacity 
            style={[styles.appointmentButton, isToday && styles.filterButtonActive]}
            onPress={onTodayPress}
          >
            <Text style={styles.appointmentButtonText}>Today</Text>
          </TouchableOpacity>
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
            }}
            date={filterMeetingDate}
            onDateChange={onFilterDateChanged}
          />
          <View style={styles.filterWrapper}>
            <TouchableOpacity 
              style={[
                styles.appointmentButton, 
                styles.filterButton,
                filterShown && styles.filterButtonActive
              ]}
              onPress={toggleFilter}
            >
              <FontAwesome 
                name='filter' 
                size={14} 
                style={[
                  {marginRight: 5}, 
                  styles.appointmentButtonText, 
                  !filterShown && {color: Colors.secondary, fontWeight: '400'}
                ]} 
              />
              <Text style={[styles.appointmentButtonText, styles.appointmentButtonTextActive, !filterShown && {color: Colors.secondary}]}>Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {filterShown && (
        <View style={[styles.dateContainer, !([filterByStatus, filterByType].every(e => e === FILTER_BY_ALL) && !filterMeetingDate) && styles.filterSection]}>
          {/* type & status */}
          <View style={styles.filterItem}>
            <Text style={[styles.textGrey, {marginRight: 10}]}>Type</Text>
            <Menu onSelect={onFilterByTypeChanged}>
              <MenuTrigger>
                <View style={[styles.appointmentButton, styles.buttonClear, {marginLeft: 0,}]}>
                  <Text style={[styles.appointmentButtonText, styles.buttonClearText]}>{_.upperFirst(_.lowerCase(filterByType))}</Text>
                  <FontAwesome name='sort-desc' size={14} color='#000' style={{marginLeft: 5, paddingBottom: 5,}} />
                </View>
              </MenuTrigger>
              <MenuOptions customStyles={{optionsWrapper: styles.optionsWrapper}}>
                <MenuOption value={FILTER_BY_ALL} customStyles={{optionWrapper: styles.optionStyle}}>
                  <Text>All</Text>
                </MenuOption>
                <MenuOption value={Appointment.Type.SENT} customStyles={{optionWrapper: styles.optionStyle}}>
                  <Text>Sent</Text>
                </MenuOption>
                <MenuOption value={Appointment.Type.RECEIVED} customStyles={{optionWrapper: {
                  ...styles.optionStyle,
                  ...{borderBottomWidth: 0}}
                }}>
                  <Text>Received</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
          <View style={[styles.filterItem, {marginLeft: 35,}]}>
            <Text style={[styles.textGrey, {marginRight: 10}]}>Status</Text>
            <Menu onSelect={onFilterByStatusChanged}>
              <MenuTrigger>
                <View style={[styles.appointmentButton, styles.buttonClear, {marginLeft: 0,}]}>
                  <Text style={[styles.appointmentButtonText, styles.buttonClearText]}>{_.upperFirst(_.lowerCase(filterByStatus))}</Text>
                  <FontAwesome name='sort-desc' size={14} color='#000' style={{marginLeft: 5, paddingBottom: 5,}} />
                </View>
              </MenuTrigger>
              <MenuOptions customStyles={{optionsWrapper: styles.optionsWrapper}}>
                <MenuOption value={FILTER_BY_ALL} customStyles={{optionWrapper: styles.optionStyle}}>
                  <Text>All</Text>
                </MenuOption>
                {[Appointment.Status.WAITING,Appointment.Status.COMPLETED,Appointment.Status.CANCELED].map((status, idx) => (
                  <MenuOption 
                    key={status}
                    value={status} 
                    customStyles={{
                      optionWrapper: 
                        idx !== Object.values(Appointment.Status).length
                        ? styles.optionStyle 
                        : {
                          ...styles.optionStyle,
                          ...{borderBottomWidth: 0}
                        }
                    }}
                  >
                    <Text>{_.upperFirst(_.lowerCase(status))}</Text>
                  </MenuOption>
                ))}
              </MenuOptions>
            </Menu>
          </View>
        </View>
      )}
      <View style={styles.filterList}>
        {filterMeetingDate && (
          <TouchableOpacity 
            style={styles.filterTag} 
            onPress={() => onRemoveFilter(FILTER_OPTIONS.DATE)}
          >
            <Text style={styles.filterTagText}>{dateText}</Text>
            <FontAwesome name='times' size={16} color='#4E5A69' />
          </TouchableOpacity>
        )}

        {filterByType && filterByType !== FILTER_BY_ALL && (
          <TouchableOpacity 
            style={styles.filterTag} 
            onPress={() => onRemoveFilter(FILTER_OPTIONS.TYPE)}
          >
            <Text style={styles.filterTagText}>{_.upperFirst(_.lowerCase(filterByType))}</Text>
            <FontAwesome name='times' size={16} color='#4E5A69' />
          </TouchableOpacity>
        )}

        {filterByStatus && filterByStatus !== FILTER_BY_ALL && (
          <TouchableOpacity 
            style={styles.filterTag} 
            onPress={() => onRemoveFilter(FILTER_OPTIONS.STATUS)}
          >
            <Text style={styles.filterTagText}>{_.upperFirst(_.lowerCase(filterByStatus))}</Text>
            <FontAwesome name='times' size={16} color='#4E5A69' />
          </TouchableOpacity>
        )}
      </View>
      {filteredAppointmentList?.length > 0 && (
        <FlatList
          data={filteredAppointmentList}
          renderItem={({item}) => renderAppointmentItem(item)}
          keyExtractor={item => `${item.id}`}
          style={{flex: 1}}
        />
      )}
      {filteredAppointmentList.length === 0 && (
        <Text style={{textAlign: 'center', marginTop: 30, fontSize: 16, fontStyle: 'italic'}}>No appointment in this date</Text>
      )}
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
    marginRight: 15,
  },
  appointmentButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  appointmentButtonTextActive: {
    fontWeight: '700'
  },
  filterWrapper: {
    flex: 1,
    alignItems: 'flex-end',
  },
  filterButton: {
    backgroundColor: 'transparent',
    marginRight: 0,
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
    marginRight: 10,
  },
  filterTagText: {
    color: '#4E5A69',
    fontSize: 16,
    marginRight: 10,
  },
  optionsWrapper: {
    marginRight: 10,
},
optionStyle: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
}
})

export default withNavigation(AppointmentList);