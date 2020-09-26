import React from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { Text, View } from 'react-native'
import Colors from '../../constants/Colors'

export default function NoContent() {
  return (
    <View style={{flex: 1,}}>
      <View style={{marginTop: 50,alignItems: 'center'}}>
        <FontAwesome name='ban' size={120} color={Colors.extraText} />
        <Text style={{textAlign: 'center', fontSize: 36, fontWeight: '500', color: Colors.extraText, marginTop: 25}}>No item</Text>
      </View>
    </View>
  )
}