import React, { useCallback } from 'react'
import { StyleSheet, FlatList,  Text, View, Image, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { ListItem, Button } from 'react-native-elements'
import Colors from '../../../constants/Colors'
import { useDispatch, useSelector } from 'react-redux'
import { getPendingAppointments } from '../../../services/app/getters'
import NoContent from '../../NoContent'
import {removeAppointment} from '../../../services/app/actions';
import { withNavigation } from 'react-navigation'

function PendingAppointment({navigation}) {
  const pendingAppointments = useSelector(getPendingAppointments);
  const dispatch = useDispatch();
  const onRemoveAppointment = useCallback((store) => {
    dispatch(removeAppointment({store}))
  }, [dispatch])

  const renderItem = useCallback((item) => {
    const currentHour = new Date().getHours()
    const isOpen = currentHour >= 8 && currentHour < 22
    return (
      <ListItem
        leftElement={
          <Image
            source={{
              uri: item.icon
            }} 
            style={styles.storeImage}
          />
        }
        title={
          <View style={styles.itemDetail}>
            <Text style={styles.storeName}>{item.storeName}</Text>
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
          <TouchableOpacity style={styles.removeItemButton} onPress={() => onRemoveAppointment(item)}>
            <FontAwesome name='times-circle' size={28} color='red' />
          </TouchableOpacity>
        }
        bottomDivider
      />
    )
  }, [])

  const onInvite = useCallback(() => {
    navigation.navigate('ContactList');
  })

  return (
    <View style={{flex: 1, justifyContent: 'flex-start'}}>
      {(!pendingAppointments || pendingAppointments.length === 0) && (
        <NoContent />
      )}
      {pendingAppointments && pendingAppointments.length > 0 && (
        <React.Fragment>
          <FlatList
            data={pendingAppointments}
            renderItem={({item}) => renderItem(item)}
            style={{flexGrow: 0}}
            keyExtractor={item => item.storeId}
          />
          <Button
            title='Invite'
            type='solid'
            buttonStyle={{
              marginTop: 30,
            }}
            titleStyle={{
              fontWeight: '700',
            }}
            onPress={onInvite}
          />
        </React.Fragment>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  storeImage: {
    width: '20%',
    height: '100%',
    resizeMode: 'contain',
  },
  itemDetail: {
    flex: 1,
    paddingLeft: 5,
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
})

export default withNavigation(PendingAppointment);