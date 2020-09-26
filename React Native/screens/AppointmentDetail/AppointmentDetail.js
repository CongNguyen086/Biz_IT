import React, { useCallback, useMemo, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import Modal from 'react-native-modal'
import { Text, View, Image, TouchableOpacity, FlatList, LayoutAnimation } from 'react-native'
import { Avatar, ListItem } from 'react-native-elements'
import {useSafeArea} from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import Colors from '../../constants/Colors'
import Appointment from '../../services/app/Appointment'
import { getCurrentUser } from '../../services/auth/getters'
import styles from './styles';

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
  const formated = new Date(date);
  return `${months[formated.getMonth()]} ${formated.getDate()}, ${formated.getFullYear()}`
}

function getShortName(name = '') {
  return name.split(' ').map(word => word?.[0] || '').join('');
}

const confirmModalState = {
  visible: false,
  onConfirm: () => {},
  onCancel: () => {},
  confirmLabel: 'Ok',
  cancelLabel: 'Cancel',
  confirmStyle: {},
  cancelStyle: {},
  title: '',
  description: ''
}

function AppointmentDetail({ appointmentData, setAppointmentData = () => {} }) {
  const insets = useSafeArea()
  const currentUser = useSelector(getCurrentUser);
  const [selectedStore, setSelectedStore] = useState(null);
  const [detailModalVisible, setDetailModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({...confirmModalState});

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
            <Text style={styles.description}>{item.promotion}</Text>
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
  }, [appointmentData])

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
              title={getShortName(member.fullName)} 
              containerStyle={{
                marginRight: 25,
              }}
            />
            <Text style={styles.memberName}>{member.fullName}</Text>
          </View>
        }
        rightElement={
          <Text style={{fontSize: 16}}>{member.userPhone}</Text>
        }
      />
    )
  }, [appointmentData])

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

  const resetConfirmModal = useCallback(() => {
    setConfirmModal({...confirmModalState});
  }, [])

  const setConfirmModalVisible = useCallback((isOpen) => {
    setConfirmModal({...confirmModal, visible: isOpen});
  }, [confirmModal])

  const onConfirmModalHide = useCallback(() => {
    resetConfirmModal();
  }, [resetConfirmModal])

  const onConfirmPress = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    if (currentUser.userId === appointmentData.hostId) {
      setConfirmModal({
        ...confirmModalState,
        visible: true,
        title: 'Are you sure to complete this appointment?',
        onConfirm: () => {
          setConfirmModalVisible(false)
          setAppointmentData({
            ...appointmentData,
            eventStatus: Appointment.Status.COMPLETED
          })
        },
        onCancel: () => setConfirmModalVisible(false)
      })
    } else {
      setConfirmModal({
        ...confirmModalState,
        visible: true,
        title: 'Are you sure to select this appointment?',
        onConfirm: () => {
          setConfirmModalVisible(false)
          setMemberStatus(currentUser.userId, Appointment.Status.SELECTED)
        },
        onCancel: () => setConfirmModalVisible(false)
      })
    }
  }, [currentUser.userId, appointmentData])

  const onCancelPress = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    if (currentUser.userId === appointmentData.hostId) {
      setConfirmModal({
        ...confirmModalState,
        visible: true,
        title: 'Are you sure to cancel this appointment?',
        confirmStyle: styles.buttonCancel,
        onConfirm: () => {
          resetConfirmModal()
          setAppointmentData({
            ...appointmentData,
            eventStatus: Appointment.Status.CANCELED
          })
        },
        onCancel: resetConfirmModal
      })
    } else {
      setConfirmModal({
        ...confirmModalState,
        visible: true,
        confirmStyle: styles.buttonCancel,
        title: 'Are you sure to decline this appointment?',
        onConfirm: () => {
          resetConfirmModal()
          setMemberStatus(currentUser.userId, Appointment.Status.DECLINED)
        },
        onCancel: resetConfirmModal
      })
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
    <React.Fragment>
      <View style={[styles.container, {paddingBottom: insets.bottom}]}>
        <View style={styles.header}>
          <Text style={styles.eventNameText}>{appointmentData.eventName}</Text>
          <Text style={styles.eventHost}>By {appointmentData.fullName}</Text>
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
                      title={getShortName(member.fullName)} 
                      containerStyle={{
                        marginRight: 25,
                      }}
                    />
                    <Text style={styles.memberName}>{member.fullName}</Text>
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
      <Modal
        isVisible={confirmModal.visible}
        onModalHide={onConfirmModalHide}
        backdropColor='rgba(0,0,0,0.8)'
        animationInTiming={500}
        animationOutTiming={500}
      >
        <View style={styles.modalWrapper}>
          <Text style={[styles.modalDetailTitle, {textAlign: 'center', marginBottom: 10,}]}>{confirmModal.title}</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.bottomButton, confirmModal.confirmStyle, {marginRight: 15},]}
              onPress={confirmModal.onConfirm}
              activeOpacity={0.85}
            >
              <Text style={styles.bottomButtonText}>{confirmModal.confirmLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.bottomButton, styles.buttonCancelModal, {marginLeft: 15}]}
              onPress={confirmModal.onCancel}
            >
              <Text style={[styles.bottomButtonText, styles.buttonCancelModalText]}>{confirmModal.cancelLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </React.Fragment>
  )
}

export default AppointmentDetail;
