import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import HeaderTitle from '../components/HeaderTitle';

class PaymentScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cash: 0
        };
    }

    static navigationOptions = {
        headerTitle: <HeaderTitle title='Thanh Toán' />,
    };

    getUserCash = async () => {
        try {
            const userId = await AsyncStorage.getItem('@userToken');
            const response = await fetch(ROOT + `/getusercash?userId=${userId}`);
            const jsonData = await response.json();
            this.setState({ cash: jsonData[0].userCash})
        } catch (error) {
            console.log(error)
        }
    }

    componentDidMount() {
        this.getUserCash();
    }

    confirmPayment = async (storeId) => {
        try {
            this.setState({ cash: this.state.cash - 52000})
            console.log('userCash: ' + this.state.cash)
            const userId = await AsyncStorage.getItem('@userToken');
            const response = await fetch(ROOT + `/putusercash?cash=${this.state.cash}&userId=${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        } catch (error) {
            console.log(error)
        }
        this.props.navigation.navigate('AfterPayment', { storeId: storeId })
    }

    render() {
        const storeId = this.props.navigation.getParam('storeId', 0);
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Image source={require('../assets/images/headerPayment.png')} style={styles.headerImage} />
                </View>
                <TouchableOpacity style={styles.bodyContainer} onPress={() => this.confirmPayment(storeId)}>
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
        flex: 0.2,
    },
    headerImage: {
        width: wp(100),
        height: hp(25),
        marginTop: hp(3)
    },
    bodyContainer: {
        flex: 0.6,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bodyImage: {
        width: wp(48),
        height: hp(24)
    },
    footerContainer: {
        flex: 0.2,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    footerImage: {
        width: wp(100),
        height: hp(6),
        marginBottom: hp(3)
    }

});

export default PaymentScreen;