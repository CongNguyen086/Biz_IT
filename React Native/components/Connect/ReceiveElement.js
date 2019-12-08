import React from 'react';
import { View, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Button } from 'react-native-elements';

const ReceiveElement = (props) => {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: hp(1.8), fontWeight: 'bold', textAlign: 'center' }}>{props.first}{'\n'} {props.second}</Text>
            <Text style={{ textAlign: 'center', color: '#ADB0B7', paddingVertical: hp(0.8) }} >{props.one}{'\n'} {props.two}</Text>
            <View>
                <Button
                    title='Nhận'
                    buttonStyle={{ backgroundColor: '#6ABA2E', paddingHorizontal: wp(4), borderRadius: 10 }}
                    onPress={props.onPress}
                    disabled={props.disabled}
                />
            </View>
        </View>
    )
}

export default ReceiveElement
