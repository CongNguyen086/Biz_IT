import { FontAwesome } from '@expo/vector-icons'
import React, { useCallback, useMemo, useState } from 'react'
import Modal from 'react-native-modal'
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, LayoutAnimation } from 'react-native'
import { Avatar, ListItem } from 'react-native-elements'
import {useSafeArea} from 'react-native-safe-area-context'
import { withNavigation } from 'react-navigation'
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
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
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

function AppointmentDetail({ navigation }) {
  const insets = useSafeArea()
  const currentUser = useSelector(getCurrentUser);
  const [appointmentData, setAppointmentData] = useState({...appointmentDataSample});
  const [selectedStore, setSelectedStore] = useState(null);
  const [detailModalVisible, setDetailModal] = useState(false);

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

  const setMemberStatus = useCallback((userId, status) => {
    const newMembers = [...appointmentData.members].map(mb => mb.userId === userId ? {...mb, status,} : mb)
    setAppointmentData({
      ...appointmentData,
      members: newMembers,
    })
  }, [appointmentData])

  const onDetailClick = useCallback((storeId) => {
    const store = appointmentData.stores.find(st => st.storeId === storeId && st.selectedMembers.length > 0);
    if (store) {
      setSelectedStore(store);
      setDetailModal(true);
    }
  }, [appointmentData.stores])

  const onCloseDetail = useCallback(() => {
    setDetailModal(false);
  }, [])

  const onModalDetailHide = useCallback(() => {
    // setSelectedStore(null);
  }, [])

  const renderItem = useCallback((item, index) => {
    const currentHour = new Date().getHours()
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
  }, [currentUserWithStatus, appointmentData.members, appointmentData.eventStatus, currentUser.userId])

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

    return (
      <ListItem 
        style={styles.memberItem} 
        key={member.userId}
        containerStyle={{paddingHorizontal: 0}}
        bottomDivider={index !== appointmentData.members.length - 1}
        leftElement={
          <View style={styles.statusCol}>
            {member.status !== Appointment.Status.DECLINED && selectedIndexs.length > 0 && (
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

  const currentUserWithStatus = useMemo(() => {
    if (currentUser.userId === appointmentData.hostId) {
      return currentUser;
    }
    return appointmentData.members.find(mb => mb.userId === currentUser.userId)
  }, [currentUser.userId, appointmentData.members, appointmentData.hostId])

  const isEventDone = useMemo(() => 
    [
      Appointment.Status.CANCELED, 
      Appointment.Status.COMPLETED,
    ].includes(appointmentData?.eventStatus) || currentUserWithStatus?.status === Appointment.Status.DECLINED,
    [appointmentData?.eventStatus, currentUserWithStatus])

  const eventDoneText = useMemo(() => {
    switch(appointmentData.eventStatus) {
      case Appointment.Status.COMPLETED:
        return 'Your appointment was completed!'
      case Appointment.Status.CANCELED:
        return 'Your appointment was canceled!'
    }
    if (currentUserWithStatus.status === Appointment.Status.DECLINED) {
      return 'You declined this appointment!'
    }

    return null;
  }, [appointmentData.eventStatus, currentUserWithStatus.status])

  const confirmButtonText = useMemo(() => {
    if (currentUser.userId === appointmentData.hostId) {
      return 'Complete'
    }

    if (currentUserWithStatus.status !== Appointment.Status.WAITING) {
      return null;
    }

    return 'Confirm'
  }, [currentUser.userId, appointmentData.hostId, currentUserWithStatus.status])

  const cancelButtonText = useMemo(() => {
    if (currentUser.userId === appointmentData.hostId) {
      return 'Cancel'
    }

    return 'Decline'
  }, [currentUser.userId, appointmentData.hostId])

  const isConfirmDisabled = useMemo(() => {
    if (currentUserWithStatus?.userId === appointmentData.hostId) {
      return false;
    }

    if (currentUserWithStatus.status === Appointment.Status.WAITING && appointmentData.stores.find(st => st.selectedMembers.includes(currentUserWithStatus?.userId))) {
      return false;
    }

    return true;
  }, [currentUserWithStatus.status, currentUserWithStatus.userId, appointmentData.stores])

  const onConfirmPress = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    if (currentUser.userId === appointmentData.hostId) {
      setAppointmentData({
        ...appointmentData,
        eventStatus: Appointment.Status.COMPLETED
      })
    } else {
      setMemberStatus(currentUser.userId, Appointment.Status.SELECTED)
    }
  }, [currentUser.userId, appointmentData])

  const onCancelPress = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    if (currentUser.userId === appointmentData.hostId) {
      setAppointmentData({
        ...appointmentData,
        eventStatus: Appointment.Status.CANCELED
      })
    } else {
      setMemberStatus(currentUser.userId, Appointment.Status.DECLINED)
    }
  }, [currentUser.userId, appointmentData])
  
  const selectedMembersAtStore = useMemo(() => {
    const memberIds = selectedStore?.selectedMembers;
    if (memberIds && memberIds?.length > 0) {
      return appointmentData.members.filter(mb => memberIds.includes(mb.userId))
    }
    return null
  }, [appointmentData.stores, appointmentData.members, selectedStore])

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
          keyExtractor={item => `${item.userId}`}
        />

        <View style={styles.buttonGroup}>
          {!isEventDone && (
            <React.Fragment>
              {confirmButtonText && (
                <TouchableOpacity 
                  style={[styles.bottomButton, {marginRight: 15}, isConfirmDisabled && styles.bottomButtonDisabled]}
                  disabled={isConfirmDisabled}
                  onPress={onConfirmPress}
                >
                  <Text style={styles.bottomButtonText}>{confirmButtonText}</Text>
                </TouchableOpacity>
              )}
              {cancelButtonText && (
                <TouchableOpacity 
                  style={[styles.bottomButton, styles.buttonCancel, confirmButtonText && {marginLeft: 15}]}
                  onPress={onCancelPress}
                >
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
            {eventDoneText}
          </Text>
        )}
      </View>
      {/* modal to show detail */}
      <Modal
        isVisible={detailModalVisible}
        backdropColor='rgba(0,0,0,0.8)'
        onModalHide={onModalDetailHide}
        animationInTiming={500}
        animationOutTiming={500}
      >
        <View style={styles.modalWrapper}>
          <Text style={styles.modalDetailTitle}>{selectedStore?.storeName}</Text>
          <View style={styles.meetingDateBox}>
            <Text style={styles.meetingDateTitle}>Meeting date:</Text>
            <Text style={styles.meetingDateText}>{formatTime(appointmentData.meetingDate)}</Text>
          </View>
          <Text style={styles.modalDetailSelectedText}>Selected members</Text>
          <FlatList 
            data={selectedMembersAtStore || []}
            keyExtractor={item => `${item.userId}`}
            style={{marginTop: 15,}}
            renderItem={({item: member, index}) => (
              <ListItem 
                style={[styles.memberItem, {paddingHorizontal: 0}]} 
                key={member.userId}
                containerStyle={{paddingHorizontal: 0}}
                topDivider={index === 0}
                bottomDivider
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
            )}
          />
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.bottomButton]}
              onPress={onCloseDetail}
              activeOpacity={0.85}
            >
              <Text style={styles.bottomButtonText}>Close</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity 
              style={[styles.bottomButton, styles.buttonCancelModal, confirmButtonText && {marginLeft: 10}]}
              onPress={onCancelPress}
            >
              <Text style={[styles.bottomButtonText, styles.buttonCancelModalText]}>Cancel</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </Modal>
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
  bottomButtonDisabled: {
    opacity: 0.7,
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
    // fontStyle: 'italic',
    fontSize: 18,
    textAlign: 'center',
  },
  modalWrapper: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
  },
  buttonCancelModal: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  buttonCancelModalText: {
    color: Colors.secondary
  },
  modalDetailSelectedText: {
    fontSize: 18,
    fontWeight: '400',
    color: Colors.extraText,
    marginTop: 20,
  },
  modalDetailTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  }
})

export default withNavigation(AppointmentDetail);
