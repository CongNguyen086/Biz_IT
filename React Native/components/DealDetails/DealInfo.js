import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CardCustom from '../CardCustom';

const dealInfo_1 = 'Discount 10-20% for bill whose value is from $20 above'
const dealInfo_2 = 'From 4/10/2020 đến 5/11/2020'

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