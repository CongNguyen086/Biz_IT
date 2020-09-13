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
  Alert, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  LayoutAnimation, 
  UIManager,
  Dimensions
} from 'react-native'
import {
  Avatar, 
  ListItem, 
  Button, 
  SearchBar, 
} from 'react-native-elements'
import * as Contacts from 'expo-contacts'
import * as Animatable from 'react-native-animatable'
import * as Permissions from 'expo-permissions'
import Colors from '../constants/Colors'
import { useDispatch, useSelector } from 'react-redux'
import { getContactList } from '../services/app/getters'
import { setContactList } from '../services/app/actions'
import { SafeAreaView } from 'react-navigation'
import SlidingUpPanel from '../components/SlidingUpPanel'

const DATA = [
  {
    id: 1,
    phone: '032633980868',
    fullName: 'Hieu Do',
    avatar: 'https://images.pexels.com/photos/1004014/pexels-photo-1004014.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
  },
  {
    id: 2,
    phone: '0123478235',
    fullName: 'Cong Nguyen',
    avatar: null,
  },
  {
    id: 3,
    phone: '025826923692',
    fullName: 'Donal Trump',
    avatar: 'https://images.pexels.com/photos/1149362/pexels-photo-1149362.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
  },
]

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const screenHeight = Dimensions.get('window').height

const ContactList = () => {
  const [isLoading, setLoading] = useState(false)
  const [isOpenSliding, setOpenSliding] = useState(false)
  const [searchText, setSearchText] = useState('')
  const slidingRef = useRef(null)
  const dispatch = useDispatch()
  const contacts = useSelector(getContactList)
  const [checkedUsers, setCheckedUsers] = useState([])
  const getShortName = useCallback((fullName = '') => {
    return fullName.split(' ').reduce((acc, current) => (acc + current?.[0] ?? ''), '')
  }, [])

  const transformContacts = useCallback(contacts => {
    return {
      firstName: contacts.firstName,
      lastName: contacts.lastName,
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
        }

        // call api to update contact list on server
        
        const list = await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(DATA)
          }, 3000)
        })
        dispatch(setContactList({contacts: list}))
      }
    }
    catch(e) {

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

  const contactList = useMemo(() => {
    if (!searchText) {
      return contacts
    }

    return (contacts || []).filter(c => 
      (
        c?.phone?.includes(searchText) || 
        c?.firstName?.includes(searchText) || 
        c?.lastName?.includes(searchText) || 
        c?.fullName?.includes(searchText)
      )
    )
  }, [contacts, searchText])

  const onCheckedUser = useCallback((userId) => {
    if (!!contactList.find(user => user.id === userId)) {
      if (checkedUsers.length === 0) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
      }
      if (!checkedUsers.includes(userId)) {
        setCheckedUsers([...checkedUsers, userId])
      } else {
        if (checkedUsers.length === 1) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
        }
        setCheckedUsers(checkedUsers.filter(uId => uId !== userId))
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
                      source={{
                        uri: item.avatar
                      }}
                      title={getShortName(item.fullName)}
                    />
                  }
                  checkBox={{
                    checked: !!checkedUsers.find(uId => uId === item.id),
                    onIconPress: () => onCheckedUser(item.id)
                  }}
                  title={item.fullName}
                  subtitle={item.phone}
                  titleStyle={styles.titleFullName}
                  subtitleStyle={styles.phoneStyle}
                  onPress={() => Alert.alert(`Press on user ${item.fullName}`)}
                />
              </Animatable.View>
            )}
            keyExtractor={item => `${item.id}`}
          />
        </View>

        {checkedUsers.length > 0 && (
          <SlidingUpPanel 
            ref={slidingRef} 
            onDragEnd={onSlidingDragEnd}
            onBottomReached={onSlidingBottomReached}
            draggableRange={{ top: screenHeight - 100, bottom: 100 }}
          >
            <View style={styles.slidingContainer}>
              <View style={styles.minimal}>
                <Text style={styles.selectedText}>{`${checkedUsers.length} selected`}</Text>
                {!isOpenSliding && (
                  <Button 
                    title='Invite' 
                    buttonStyle={[styles.inviteButton, {paddingVertical: 3, paddingHorizontal: 15}]}
                    titleStyle={{fontWeight: '600'}}
                  />
                )}
              </View>
            </View>
          </SlidingUpPanel>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
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
  }
})

export default ContactList

