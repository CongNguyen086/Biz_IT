import React, { Component } from 'react';
import { StyleSheet, View, Share } from 'react-native';
import { Button } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import ReviewProfile from '../components/AfterPayment/ReviewProfile';
import BillProfile from '../components/AfterPayment/BillProfile';

import HeaderTitle from '../components/HeaderTitle';
import Colors from '../constants/Colors';

class AfterPaymentScreen extends Component {
    constructor (props) {
        super(props)
        this.state = {
            randomCode: ''
        }
    }
    static navigationOptions = {
        headerTitle: <HeaderTitle title='Thanh Toán' />,
    };

    componentDidMount () {
        this.setState({ randomCode: Math.random().toString(36).substr(2, 10) })
    }

    onShare = async () => {
        try {
            const result = await Share.share({
                message: this.state.randomCode
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    render() {
        const storeId = this.props.navigation.getParam('storeId', 0);
        return (
            <View style={styles.container}>
                <View style={styles.review}>
                    <ReviewProfile
                        star={5}
                        storeId={storeId}
                    />
                </View>
                <View style={styles.bill}>
                    <BillProfile />
                </View>
                <View style={styles.buttonContainer}>
                    <Button type='solid'
                        title='Rủ bạn bè ngay'
                        buttonStyle={styles.button}
                        titleStyle={{ fontSize: hp(2) }}
                        onPress={() => this.onShare()} />
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
        marginTop: hp(2),
        borderRadius: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
    },
    buttonContainer: {
        flex: 0.1,
        justifyContent: 'center',
        marginHorizontal: wp(5),
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