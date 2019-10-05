import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity
} from 'react-native';

import HeaderTitle from '../components/HeaderTitle';
import Layout from '../constants/Layout'

const width = Layout.width;
const height = Layout.height;

class PaymentScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    static navigationOptions = {
        headerTitle: <HeaderTitle title='Thanh Toán' />,
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Image source={require('../assets/images/headerPayment.png')} style={styles.headerImage} />  
                </View>
                <TouchableOpacity style={styles.bodyContainer}>
                    <Image source={require('../assets/images/bodyPayment.png')} style={styles.bodyImage} />
                </TouchableOpacity>
                <View style={styles.footerContainer}>
                    <Image source={require('../assets/images/footerPayment.png')} style={styles.footerImage} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerContainer: {
        flex: 0.25,
    },
    headerImage: {
        width: width,
        height: '100%',
        marginTop: 20
    },
    bodyContainer: {
        flex: 0.55,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bodyImage: {
        width: '50%',
        height: '50%'
    },
    footerContainer: {
        flex: 0.2,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    footerImage: {
        width: '100%',
        height: '40%',
        marginBottom: 20
    }

});

export default PaymentScreen;