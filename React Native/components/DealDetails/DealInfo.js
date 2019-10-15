import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions, Alert, Image } from 'react-native';
import CardCustom from '../CardCustom';

const dealInfo_1 = 'Hoàn tiền 20-30% khi thanh toán tại quán bằng Momo'
const dealInfo_2 = 'Từ 4/10/2019 đến 30/10/2019'

class DealInfo extends Component {
    render() {
        return (
            <CardCustom image={require('../../assets/images/cafe_image.jpg')}>
                <View style={styles.textView}>
                    <Text style={styles.description}>
                        {dealInfo_1}
                    </Text>
                    <Text style={styles.date}>
                        {dealInfo_2}
                    </Text>
                </View>
            </CardCustom>
        );
    }
}

const styles = StyleSheet.create({
    textView: {
        height: 70,
        marginTop: 7,
        marginHorizontal: 10,
    },
    description: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    date: {
        color: 'black',
        textAlign: 'center',
        lineHeight: 40,
    },
});

export default DealInfo;