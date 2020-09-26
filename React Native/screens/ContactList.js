import React, { 
  useCallback, 
  useEffect, 
  useMemo, 
  useRef, 
  useState 
} from 'react'
import { 
  Text, 
  View, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  LayoutAnimation, 
  UIManager,
  Dimensions, 
  TouchableOpacity,
  ScrollView, 
  Keyboard
} from 'react-native'
import {
  Avatar, 
  ListItem, 
  Button, 
  SearchBar, 
  Input,
} from 'react-native-elements'
import * as Contacts from 'expo-contacts'
import * as Animatable from 'react-native-animatable'
import * as Permissions from 'expo-permissions'
import Colors from '../constants/Colors'
import { useDispatch, useSelector } from 'react-redux'
import { getContactList, getPendingAppointments } from '../services/app/getters'
import { setContactList } from '../services/app/actions'
import { SafeAreaView } from 'react-navigation'
import SlidingUpPanel from '../components/SlidingUpPanel'
import DatePicker from 'react-native-datepicker';
import AppRepo from '../services/app/repo'
import HeaderTitle from '../components/HeaderTitle'
import NoContent from '../components/NoContent'
import { getCurrentUser } from '../services/auth/getters'
import { CREATE_NEW_APPOINTMENT, FETCH_APPOINTMENTS } from '../services/app/constants'

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const screenHeight = Dimensions.get('window').height

function normalizeText(text = '') {
  return text.toLowerCase()
}

const ContactList = ({navigation}) => {
  const [isLoading, setLoading] = useState(false)
  const [isOpenSliding, setOpenSliding] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [searchText, setSearchText] = useState('')
  const [meetingDate, setMeetingDate] = useState(new Date())
  const [meetingEventName, setEventName] = useState('')
  const slidingRef = useRef(null)
  const dispatch = useDispatch()
  const contacts = useSelector(getContactList)
  const [checkedUsers, setCheckedUsers] = useState([])
  const currentUser = useSelector(getCurrentUser);
  const pendingAppointments = useSelector(getPendingAppointments);
  const getShortName = useCallback((fullName = '') => {
    return fullName.split(' ').reduce((acc, current) => (acc + current?.[0] ?? ''), '')
  }, [])

  const transformContacts = useCallback(contacts => {
    return {
      firstName: contacts.firstName,
      lastName: contacts.lastName,
      fullName: `${contacts.lastName} ${contacts.firstName}`,
      phoneNumbers: contacts.phoneNumbers.map(p => p.digits)
    }
  })

  const syncContacts = useCallback(async () => {
    try {
      setLoading(true)
      const { status } = await Permissions.askAsync(Permissions.CONTACTS)
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [
            Contacts.Fields.Name,
            Contacts.Fields.PhoneNumbers
          ],
          sort: Contacts.SortTypes.FirstName
        });

        if (data.length > 0) {
          const listContacts = data.map(c => transformContacts(c))
          // call api to update contact list on server
          const listPhones = listContacts.reduce((list, c) => {
            return [...list, ...c.phoneNumbers]
          },[])
          const listPhoneNumber = await AppRepo.getContactList(listPhones);
  
          const list = []
          // for (const phoneNumber of listPhoneNumber) {
          //   for (const c of listContacts) {
          //     if (c.phoneNumbers.includes(phoneNumber)) {
          //       list.push({
          //         ...c,
          //         phoneNumber: phoneNumber
          //       })
          //     }
          //   }
          // }
          for (const c of listContacts) {
            for (const p of listPhoneNumber) {
              if (c.phoneNumbers.includes(p.userPhone)) {
                list.push({
                  userId: p.userId,
                  ...c,
                  phoneNumber: p.userPhone,
                })
              }
            }
          }
          dispatch(setContactList({contacts: list}))
        }
      }
    }
    catch(e) {
      console.log("ContactList -> e", e.message)
    }
    finally {
      setLoading(false)
    }
  }, [])

  const onSearchChanged = useCallback(text => {
    setSearchText(text)
  }, [])

  const onSearchClear = useCallback(() => {
    setSearchText('')
  }, [])

  const onMeetingDateChanged = useCallback((selectedDate) => {
    setMeetingDate(selectedDate)
  }, [])

  const contactList = useMemo(() => {
    if (!searchText) {
      return contacts
    }

    return (contacts || []).filter(c => 
      (
        c?.phone?.includes(searchText) || 
        normalizeText(c?.firstName)?.includes(normalizeText(searchText)) || 
        normalizeText(c?.lastName)?.includes(normalizeText(searchText)) || 
        normalizeText(c?.fullName)?.includes(normalizeText(searchText))
      )
    )
  }, [contacts, searchText])

  const selectedUsers = useMemo(() => {
    return contacts.filter(c => checkedUsers.includes(c.phoneNumber))
  }, [contacts, checkedUsers])

  const onCheckedUser = useCallback((phoneNumber) => {
    if (!!contactList.find(user => user.phoneNumber === phoneNumber)) {
      if (checkedUsers.length === 0) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
      }
      if (!checkedUsers.includes(phoneNumber)) {
        setCheckedUsers([...checkedUsers, phoneNumber])
      } else {
        if (checkedUsers.length === 1) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
        }
        setCheckedUsers(checkedUsers.filter(p => p !== phoneNumber))
      }
    }
  }, [contactList, checkedUsers])

  const onSlidingBottomReached = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setOpenSliding(false)
  }, [])

  const onSlidingDragEnd = useCallback((position, gestureState) => {
    // mean move to top
    if (gestureState.dy < 0) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setOpenSliding(true)
    }
  })

  const onSmallInvitePress = useCallback(() => {
    slidingRef.current.show();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setOpenSliding(true)
  }, [])

  const onCreateNewAppointment = () => {
    if (currentUser?.userId) {
      dispatch({
        type: CREATE_NEW_APPOINTMENT,
        payload: {
          userId: currentUser.userId,
          storeIds: pendingAppointments.map(store => store.storeId),
          memberIds: selectedUsers.map(u => u.userId),
          eventName: meetingEventName,
          meetingDate,
        },
        meta: {
          onSuccess: () => {
            navigation.pop();
            dispatch({
              type: FETCH_APPOINTMENTS,
            })
          },
          onFailed: () => console.log('failed')
        }
      })
    }
  }

  useEffect(() => {
    Keyboard.addListener("keyboardWillShow", _keyboardWillShow);
    Keyboard.addListener("keyboardWillHide", _keyboardWillHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardWillShow", _keyboardWillShow);
      Keyboard.removeListener("keyboardWillHide", _keyboardWillHide);
    };
  }, []);

  const _keyboardWillShow = (e) => {
    setKeyboardHeight(e.endCoordinates.height)
  };

  const _keyboardWillHide = () => {
    setKeyboardHeight(0);
    if (isOpenSliding) {
      slidingRef.current.show();
    }
  };

  useEffect(() => {
    syncContacts()
  }, [syncContacts])

  return (
    <KeyboardAvoidingView 
      style={{flex: 1,}} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        {isLoading && (
          <Animatable.View animation='fadeIn' duration={300} style={styles.loading}>
            <ActivityIndicator size='large' color={Colors.primary} style={{zIndex: 10}} />
          </Animatable.View>
        )}
        <SearchBar
          placeholder='Find phone number/name' 
          round
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInput}
          inputStyle={{fontSize: 18}}
          placeholderTextColor='#ccc'
          lightTheme
          value={searchText}
          onChangeText={onSearchChanged}
          onClear={onSearchClear}
        />
        <View style={[styles.card, checkedUsers.length > 0 && {marginBottom: 80}]}>
          <View style={styles.header}>
            <Text style={styles.textHeader}>All contacts</Text>
            <Button 
              buttonStyle={styles.syncButton} 
              icon={{
                name: "sync",
                size: 20,
                color: "white"
              }}
              title='Sync'
              titleStyle={{fontSize: 20}}
              onPress={syncContacts}
            />
          </View>
          {contactList.length === 0 && (
            <NoContent />
          )}
          <FlatList
            style={{flex: 1}}
            data={contactList}
            renderItem={({item, index}) => (
              <Animatable.View animation='fadeInUp' duration={300} delay={150 * index}>
                <ListItem 
                  bottomDivider
                  containerStyle={{paddingHorizontal: 0}}
                  leftAvatar={
                    <Avatar
                      rounded
                      source={
                        item.avatar 
                          ? {
                            uri: item.avatar
                          } 
                          : null
                      }
                      title={getShortName(item.fullName)}
                    />
                  }
                  checkBox={{
                    checked: !!checkedUsers.find(p => p === item.phoneNumber),
                    onIconPress: () => onCheckedUser(item.phoneNumber)
                  }}
                  title={item.fullName}
                  subtitle={item.phone}
                  titleStyle={styles.titleFullName}
                  subtitleStyle={styles.phoneStyle}
                  onPress={() => onCheckedUser(item.phoneNumber)}
                  Component={TouchableOpacity}
                />
              </Animatable.View>
            )}
            keyExtractor={item => `${item.phoneNumber}`}
          />
        </View>

        {checkedUsers.length > 0 && (
          <SlidingUpPanel 
            ref={slidingRef} 
            onDragEnd={onSlidingDragEnd}
            onBottomReached={onSlidingBottomReached}
            draggableRange={{ top: screenHeight - (keyboardHeight ? keyboardHeight + 10 : 100), bottom: 100 }}
          >
            <ScrollView style={styles.slidingContainer}>
              <View style={styles.minimal}>
                <Text style={styles.selectedText}>{`${checkedUsers.length} selected`}</Text>
                {!isOpenSliding && (
                  <Button 
                    title='Invite' 
                    buttonStyle={[styles.inviteButton, {paddingVertical: 3, paddingHorizontal: 15}]}
                    titleStyle={{fontWeight: '600'}}
                    onPress={onSmallInvitePress}
                  />
                )}
              </View>
              <View style={[{flex: 1}, !isOpenSliding && {display: 'none'}]}>
                <View style={styles.slidingSection}>
                  {selectedUsers.map(user => (
                    <ListItem 
                      key={user.userId}
                      bottomDivider
                      containerStyle={{paddingHorizontal: 0}}
                      leftAvatar={
                        <Avatar
                          rounded
                          source={user.avatar ? {uri: user.avatar} : null}
                          title={getShortName(user.fullName)}
                        />
                      }
                      title={(
                        <View style={styles.slidingContactContent}>
                          <Text style={styles.titleFullName}>{user.fullName}</Text>
                          <Text style={styles.phoneStyle}>{user.phone}</Text>
                        </View>
                      )}
                      Component={View}
                    />
                  ))}
                </View>
                <View style={styles.slidingSection}>
                  <View style={styles.moreInfoSection}>
                    <Text style={{width: '35%'}}>Your event name</Text>
                    <Input 
                      containerStyle={{flex: 1, paddingHorizontal: 0}} 
                      inputContainerStyle={styles.meetingPlace} 
                      value={meetingEventName}
                      placeholder='Event'
                      onChangeText={setEventName}
                    />
                  </View>
                  <View style={styles.moreInfoSection}>
                    <Text style={{width: '35%'}}>Choose meeting date</Text>
                    <DatePicker 
                      date={meetingDate}
                      mode='date'
                      format='DD-MM-YYYY'
                      minDate={new Date()}
                      cancelBtnText='Cancel'
                      confirmBtnText='Confirm'
                      showIcon={false}
                      onDateChange={onMeetingDateChanged}
                      style={{
                        flex: 1,
                      }}
                      customStyles={{
                        dateTouchBody: {
                          padding: 0,
                          width: '100%',
                        },
                        dateInput: {
                          borderRadius: 20,
                          borderColor: '#ccc',
                          height: 40
                        }
                      }}
                    />
                  </View>
                </View>
                <Button 
                  title='Invite' 
                  buttonStyle={[styles.inviteButton, {paddingVertical: 10, width: '100%'}, styles.slidingSection]}
                  titleStyle={{fontWeight: '600'}} 
                  onPress={onCreateNewAppointment}
                />
              </View>
            </ScrollView>
          </SlidingUpPanel>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

ContactList.navigationOptions = {
  headerTitle: <HeaderTitle title='Contacts' />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: Colors.bgColor
  },
  loading: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textHeader: {
    fontSize: 20,
    fontWeight: '600'
  },
  syncButton: {
    borderRadius: 25,
    paddingRight: 15,
    paddingVertical: 5,
    justifyContent: 'center'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowOffset: {
      width: 2,
      height: 7,
    },
    flex: 1,
    overflow: 'hidden',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  titleFullName: {
    fontSize: 20,
    fontWeight: '500',
  },
  phoneStyle: {
    marginTop: 5,
    fontSize: 14,
    color: '#636e72'
  },
  searchContainer: {
    marginVertical: 25, 
    backgroundColor: 'transparent', 
    borderTopColor: 'transparent', 
    borderBottomColor: 'transparent', 
    padding: 0,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 40,
    paddingHorizontal: 5,
    shadowColor: 'rgba(0,0,0,0.8)',
    shadowOffset: {
      width: 3,
      height: 10,
    },
    shadowOpacity: 0.8,
  },
  slidingContainer: {
    flex: 1,
  },
  minimal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  selectedText: {
    fontSize: 17,
  },
  inviteButton: {
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  slidingContactContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slidingSection: {
    marginTop: 25,
  },
  moreInfoSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 15,
  },
  meetingPlace: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 40,
  }
})

export default ContactList

