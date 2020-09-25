import { FontAwesome } from '@expo/vector-icons'
import React, { useCallback, useMemo, useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native'
import { Avatar, ListItem } from 'react-native-elements'
import {useSafeArea} from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import HeaderTitle from '../components/HeaderTitle'
import Colors from '../constants/Colors'
import Appointment from '../services/app/Appointment'
import { getCurrentUser } from '../services/auth/getters'

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function formatTime(date) {
  return `${months[date.getMonth()]} ${date.getDate() + 1}, ${date.getYear()}`
}

function getShortName(name = '') {
  return name.split(' ').map(word => word?.[0] || '').join('');
}

const appointmentDataSample = {
  members: [
    {
      userId: '374917359715',
      userName: 'Hieu Do',
      avatar: null,
      userPhone: '91256701248',
      status: Appointment.Status.SELECTED,
    },
    {
      userId: '8159657106479438377',
      userName: 'Hieu 2222',
      avatar: null,
      userPhone: '91256701249',
      status: Appointment.Status.WAITING,
    },
  ],
  stores: [
    {
      storeId: '8023858305',
      storeName: ' wehlfe jgjewlg',
      storeAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_bOozfBZ1FdTnKoUwZ65LVp_HgEI-r3bW9g&usqp=CAU",
      storeRating: 4.5,
      description: 'Discount 20% for bill whose value is from $20 above',
      selectedMembers: ['8159657106479438377']
    },
    {
      storeId: '8023858306',
      storeName: ' wehlfe jgjewlg',
      storeAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_bOozfBZ1FdTnKoUwZ65LVp_HgEI-r3bW9g&usqp=CAU",
      storeRating: 4.5,
      description: 'Discount 20% for bill whose value is from $20 above',
      selectedMembers: ['374917359715']
    },
    {
      storeId: '8023858307',
      storeName: ' wehlfe jgjewlg',
      storeAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_bOozfBZ1FdTnKoUwZ65LVp_HgEI-r3bW9g&usqp=CAU",
      storeRating: 4.5,
      description: 'Discount 20% for bill whose value is from $20 above',
      selectedMembers: []
    },
  ],
  hostId: '387915791',
  hostName: 'Hoang Nguyen',
  meetingDate: new Date(Date.now() + 86400*1000),
  eventName: 'Old friends reuinion',
  eventStatus: Appointment.Status.WAITING,
}

function AppointmentDetail() {
  const insets = useSafeArea()
  const currentUser = useSelector(getCurrentUser);
  const [appointmentData, setAppointmentData] = useState(appointmentDataSample);

  const onSelectClick = useCallback((storeId) => {
    toggleSelect(currentUser.userId, storeId)
  }, [currentUser])

  const toggleSelect = useCallback((userId, storeId) => {
    const {stores} = appointmentData;
    let newStores = [...stores]

    newStores = newStores.map(st => {
      if (st.storeId === storeId) {
        if (st.selectedMembers.includes(userId)) {
          st.selectedMembers = st.selectedMembers.filter(uId => uId !== userId)
        } else {
          st.selectedMembers.push(userId)
        }
      }
      return st;
    })

    setAppointmentData({
      ...appointmentData,
      stores: newStores,
    })
    
  }, [appointmentData])

  const onDetailClick = useCallback(storeId => {

  }, [])

  const renderItem = useCallback((item, index) => {
    const currentHour = new Date().getHours() + 1
    const isOpen = currentHour >= 8 && currentHour < 22

    const isISelected = item.selectedMembers.includes(currentUser?.userId);
    const selectable = [
      Appointment.Status.WAITING,
    ].includes(currentUserWithStatus?.status)
    && appointmentData.eventStatus === Appointment.Status.WAITING;
    return (
      <ListItem
        key={item.storeId}
        containerStyle={{paddingHorizontal: 0}}
        onPress={() => onDetailClick(item.storeId)}
        leftElement={
          <Image
            source={{
              uri: item.storeAvatar
            }} 
            style={styles.storeImage}
          />
        }
        title={
          <View style={styles.itemDetail}>
            <Text style={styles.storeName}>
              {item.storeName}
              <Text style={styles.storeIndex}>{`(${index + 1})`}</Text>
            </Text>
            <View style={styles.subtitle}>
              <FontAwesome name='star' size={15} color='#FFC601' />
              <Text style={styles.extraText}>{item.storeRating}</Text>
              <FontAwesome name='circle' size={15} color={isOpen ? '#40E247' : '#bdc3c7'} />
              <Text style={[styles.extraText, {color: Colors.extraText,}]}>8:00 - 22:00</Text>
              <Text style={styles.categoryName}>Cafe</Text>
            </View>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        }
        rightElement={
          <View style={styles.rightElement}>
            <TouchableOpacity 
              style={[styles.selectButton, {backgroundColor: '#fff'}]}
              onPress={() => onDetailClick(item.storeId)}
            >
              <Text style={[styles.selectButtonText, {color: Colors.primary}]}>Detail</Text>
            </TouchableOpacity>

            <Text 
              style={styles.selectedText}
            >
              {`${item.selectedMembers.length}/${appointmentData.members.length}`} selected
            </Text>

            <TouchableOpacity 
              style={[styles.selectButton, !selectable && {backgroundColor: '#ccc'}, isISelected && {backgroundColor: Colors.completed}]} 
              onPress={!selectable ? null : () => onSelectClick(item.storeId)}
              activeOpacity={!selectable ? 1 : 0.5}
            >
              <Text style={styles.selectButtonText}>{`${isISelected ? 'Selected': 'Select'}`}</Text>
            </TouchableOpacity>
          </View>
        }
        bottomDivider
      />
    )
  }, [])

  const MembersHeader = useMemo(() => {
    const votedNumber = appointmentData.members.reduce((acc, current) => {
      acc += [Appointment.Status.DECLINED, Appointment.Status.SELECTED].includes(current.status) ? 1 : 0
      return acc;
    }, 0)
    return (
      <View style={{padding: 10, borderBottomColor: '#ccc', borderBottomWidth: 1, backgroundColor: '#fff'}}>
        <Text style={{fontSize: 16,}}>{`${votedNumber}/${appointmentData.members.length} voted`}</Text>
      </View>
    )
  })

  const renderMembers = useCallback((member, index) => {
    let selectedIndexs = [];
    let isVoted = false;
    
    if (Appointment.Status.isVoted(member.status)) {
      isVoted = true;
    }

    for (let i = 0; i < appointmentData.stores.length; i+=1) {
      if (appointmentData.stores[i].selectedMembers.includes(member.userId)) {
        selectedIndexs.push(i)
      }
    }
    console.log("renderMembers -> selectedIndexs", selectedIndexs)

    return (
      <ListItem 
        style={styles.memberItem} 
        key={member.userId}
        containerStyle={{paddingHorizontal: 0}}
        bottomDivider={index !== appointmentData.members.length - 1}
        leftElement={
          <View style={styles.statusCol}>
            {selectedIndexs.length > 0 && (
              <Text style={styles.storeIndex}>{selectedIndexs.map((val, index) => ((index === 0 ? '' : ',') + `${val + 1}`))}</Text>
            )}
            {isVoted && member.status === Appointment.Status.DECLINED && (
              <FontAwesome size={20} name='times' color='#FF0000' />
            )}
          </View>
        }
        title={
          <View style={styles.memberNameBox}>
            <Avatar 
              rounded 
              title={getShortName(member.userName)} 
              containerStyle={{
                marginRight: 25,
              }}
            />
            <Text style={styles.memberName}>{member.userName}</Text>
          </View>
        }
        rightElement={
          <Text style={{fontSize: 16}}>{member.userPhone}</Text>
        }
      />
    )
  }, [])

  const isEventDone = useMemo(() => 
    [
      Appointment.Status.CANCELED, 
      Appointment.Status.COMPLETED
    ].includes(appointmentData?.eventStatus), 
  [appointmentData?.eventStatus])

  const currentUserWithStatus = useMemo(() => appointmentData.members.find(mb => mb.userId === currentUser.userId), [])

  const confirmButtonText = useMemo(() => {
    if (currentUser.userId === appointmentData.hostId) {
      return 'Complete'
    }

    if (currentUserWithStatus.status !== Appointment.Status.WAITING) {
      return null;
    }

    return 'Confirm'
  }, [])

  const cancelButtonText = useMemo(() => {
    if (currentUser.userId === appointmentData.hostId) {
      return 'Cancel'
    }

    return 'Decline'
  }, [])
  
  return (
    <View style={[styles.safeView, { paddingLeft: insets.left, paddingRight: insets.right}]}>
      <View style={[styles.container, {paddingBottom: insets.bottom}]}>
        <View style={styles.header}>
          <Text style={styles.eventNameText}>{appointmentData.eventName}</Text>
          <Text style={styles.eventHost}>By {appointmentData.hostName}</Text>
        </View>

        <View style={styles.storeList}>
          {appointmentData.stores.map(renderItem)}
        </View>

        <View style={styles.meetingDateBox}>
          <Text style={styles.meetingDateTitle}>Meeting date:</Text>
          <Text style={styles.meetingDateText}>{formatTime(appointmentData.meetingDate)}</Text>
        </View>

        <FlatList 
          style={styles.membersList} 
          ListHeaderComponent={MembersHeader}
          stickyHeaderIndices={[0]}
          data={appointmentData.members}
          renderItem={({item, index}) => renderMembers(item, index)}
          showsVerticalScrollIndicator
        />

        <View style={styles.buttonGroup}>
          {!isEventDone && (
            <React.Fragment>
              {confirmButtonText && (
                <TouchableOpacity style={[styles.bottomButton, {marginRight: 15}]}>
                  <Text style={styles.bottomButtonText}>{confirmButtonText}</Text>
                </TouchableOpacity>
              )}
              {cancelButtonText && (
                <TouchableOpacity style={[styles.bottomButton, styles.buttonCancel, confirmButtonText && {marginLeft: 15}]}>
                  <Text style={styles.bottomButtonText}>{cancelButtonText}</Text>
                </TouchableOpacity>
              )}
            </React.Fragment>
          )}
        </View>
        {isEventDone && (
          <Text 
            style={[
              styles.canceledAppointmentText, 
              appointmentData.eventStatus === Appointment.Status.COMPLETED 
                ? {color: Colors.completed} 
                : {color: Colors.declined}
            ]}
          >
            {`${appointmentData.eventStatus === Appointment.Status.COMPLETED ? 'Your appointment was completed!' : 'Your appointment was canceled!'}`}
          </Text>
        )}
      </View>
    </View>
  )
}

AppointmentDetail.navigationOptions = {
  headerTitle: <HeaderTitle title='Appointment detail' />
}

const styles = StyleSheet.create({
  safeView: {
    backgroundColor: Colors.bgColor,
    flex: 1,
  },
  container: {
    paddingHorizontal: 10,
    marginTop: 30,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  eventNameText: {
    fontSize: 20,
    fontWeight: '700',
  },
  eventHost: {
    fontStyle: 'italic',
    fontWeight: '600',
    fontSize: 18,
    color: '#4E5A69',
  },
  storeIndex: {
    color: Colors.completed,
    fontWeight: '600',
    fontSize: 16,
  },
  storeImage: {
    width: '20%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemDetail: {
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    flexDirection: 'row',
    alignItems : 'center',
    marginTop: 5,
  },
  description: {
    marginTop: 10,
  },
  removeItemButton: {
    paddingHorizontal: 5,
  },
  extraText: {
    paddingHorizontal: 6,
  },
  categoryName: {
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.extraText,
  },
  selectButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  rightElement: {
    // width: '20%',
    minWidth: 50,
    justifyContent: 'flex-start',
    height: '100%',
    alignItems: 'flex-end'
  },
  selectedText: {
    marginBottom: 10,
    color: Colors.extraText,
    fontWeight: '400'
  },
  meetingDateBox: {
    paddingVertical: 10,
    flexDirection: 'row',
  },
  meetingDateTitle: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  meetingDateText: {
    color: Colors.extraText,
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 15,
  },
  bottomButton: {
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 13,
    flex: 1,
    backgroundColor: Colors.primary,
  },
  bottomButtonText: {
    fontWeight: '700',
    color: '#fff',
    fontSize: 16,
  },
  buttonCancel: {
    backgroundColor: '#EB5757'
  },
  membersList: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
  },
  memberItem: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
  },
  statusCol: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  memberNameBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 18,
  },
  canceledAppointmentText: {
    fontStyle: 'italic',
    fontSize: 16,
    textAlign: 'center',
  }
})

export default AppointmentDetail;
