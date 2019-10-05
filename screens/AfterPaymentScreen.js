import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Dimensions,
    Alert,
    Image,
} from 'react-native';
import { Button } from 'react-native-elements';

import ReviewProfile from '../components/AfterPayment/ReviewProfile';
import BillProfile from '../components/AfterPayment/BillProfile';

import Layout from '../constants/Layout'

const width = Layout.width;
const height = Layout.height;


import HeaderTitle from '../components/HeaderTitle';
import Colors from '../constants/Colors';

class AfterPaymentScreen extends Component {
    static navigationOptions = {
        headerTitle: <HeaderTitle title='Thanh Toán' />,
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.review}>
                    <ReviewProfile star={5} />
                </View>
                <View style={styles.bill}>
                    <BillProfile />
                </View>
                {/* <View style={styles.buttonContainer}>
                    <Button title='Rủ bạn bè ngay' color="#AE2070" style={styles.button} />
                </View> */}
                <View style={styles.buttonContainer}>
                    <Button type='solid'
                        title='Rủ bạn bè ngay'
                        buttonStyle={styles.button}
                        titleStyle={{ fontSize: 18 }} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    review: {
        flex: 0.5,
        backgroundColor: 'white',
    },
    bill: {
        flex: 0.4,
        backgroundColor: 'white',
        marginTop: 17
    },
    buttonContainer: {
        flex: 0.1,
        justifyContent: 'center',
        marginHorizontal: 25,
    },
    button: {
        backgroundColor: '#AE2070',
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
    },
});

export default AfterPaymentScreen;