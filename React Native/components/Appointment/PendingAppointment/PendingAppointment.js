import React, { useCallback } from 'react'
import { StyleSheet, FlatList,  Text, View, Image, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { ListItem, Button } from 'react-native-elements'
import Colors from '../../../constants/Colors'

const stores = [
  {
    "description": "Hoàn tiền 20% trên tổng hóa đơn",
    "distance": 1504,
    "icon": "https://i.imgur.com/RyIHv67.jpg",
    "latitude": "10.743074",
    "longitude": " 106.684632",
    "merchantAddress": "28/8 Bùi Viện, phường Phạm Ngũ Lão, Quận 1, Hồ Chí Minh, Việt Nam",
    "merchantName": "Circle K HCM",
    "serviceId": "7241075282237721387",
    "storeAddress": "277 Âu Dương Lân, Phường 2, Quận 8, Thành Phố Hồ Chí Minh, VIỆT NAM",
    "storeId": "6548966503291920184",
    "storeName": "Circle K 277 Âu Dương Lân",
    "storeRating": 3,
  },
  {
    "description": "Hoàn tiền 20% trên tổng hóa đơn",
    "distance": 1531,
    "icon": "https://i.imgur.com/RyIHv67.jpg",
    "latitude": "10.754840",
    "longitude": " 106.694561",
    "merchantAddress": "28/8 Bùi Viện, phường Phạm Ngũ Lão, Quận 1, Hồ Chí Minh, Việt Nam",
    "merchantName": "Circle K HCM",
    "serviceId": "7241075282237721387",
    "storeAddress": "62 Nguyễn Khoái, Phường 2, Quận 4, Thành Phố Hồ Chí Minh, VIỆT NAM",
    "storeId": "9195809835814820357",
    "storeName": "Circle K 62 Nguyễn Khoái",
    "storeRating": 3,
  },
  {
    "description": "Hoàn tiền 20% trên tổng hóa đơn",
    "distance": 1563,
    "icon": "https://i.imgur.com/RyIHv67.jpg",
    "latitude": "10.769974",
    "longitude": " 106.681909",
    "merchantAddress": "28/8 Bùi Viện, phường Phạm Ngũ Lão, Quận 1, Hồ Chí Minh, Việt Nam",
    "merchantName": "Circle K HCM",
    "serviceId": "7241075282237721387",
    "storeAddress": "45 Cao Thắng, Phường 3, Quận 3, Thành Phố Hồ Chí Minh, VIỆT NAM",
    "storeId": "816879216657496047",
    "storeName": "Circle K 45 Cao Thắng",
    "storeRating": 3,
  },
]

export default function PendingAppointment() {
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
          <TouchableOpacity style={styles.removeItemButton}>
            <FontAwesome name='times-circle' size={28} color='red' />
          </TouchableOpacity>
        }
        bottomDivider
      />
    )
  }, [])
return (
    <View style={{flex: 1, justifyContent: 'flex-start'}}>
      <FlatList
        data={stores}
        renderItem={({item, index}) => renderItem(item)}
        style={{flexGrow: 0}}
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
      />
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
