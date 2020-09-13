import React, { useCallback, useEffect, useState } from 'react'
import { Text, View, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native'
import {Avatar, ListItem, Button} from 'react-native-elements'
import * as Contacts from 'expo-contacts'
import * as Animatable from 'react-native-animatable'
import * as Permissions from 'expo-permissions'
import Colors from '../constants/Colors'
import { useDispatch, useSelector } from 'react-redux'
import { getContactList } from '../services/app/getters'
import { setContactList } from '../services/app/actions'
import { SafeAreaView } from 'react-navigation'

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

const ContactList = () => {
  const [isLoading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const contacts = useSelector(getContactList)
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

  useEffect(() => {
    syncContacts()
  }, [syncContacts])

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && (
        <Animatable.View animation='fadeIn' duration={300} style={styles.loading}>
          <ActivityIndicator size='large' color={Colors.primary} style={{zIndex: 10}} />
        </Animatable.View>
      )}
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.textHeader}>All contacts</Text>
          <Button 
            buttonStyle={styles.syncButton} 
            icon={{
              name: "sync",
              size: 24,
              color: "white"
            }}
            title='Sync'
            onPress={syncContacts}
          />
        </View>
        <FlatList
          style={{flex: 1}}
          data={contacts}
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
    </SafeAreaView>
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
    paddingTop: 10,
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
    paddingVertical: 7,
  },
  card: {
    marginTop: 40,
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
  }
})

export default ContactList

