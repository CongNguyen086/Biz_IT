import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CardCustom from '../CardCustom';

const dealInfo_1 = 'Hoàn tiền 20-30% khi thanh toán tại quán bằng Momo'
const dealInfo_2 = 'Từ 4/10/2019 đến 30/10/2019'

class DealInfo extends Component {
    render() {
        return (
            <CardCustom image={this.props.image}>
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