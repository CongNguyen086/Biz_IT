import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class BillProfile extends Component {
    render() {
        return (
            <View style={styles.container}>
            <View styles={styles.header}>
                <Text style={styles.labelHeader}>Hóa đơn của bạn</Text>
            </View>
            <View style={styles.bodyContainer}>
                <View style={styles.labelStyle}>
                    <Text style={styles.labelLeft}>Số Tiền</Text>
                    <Text style={styles.labelRight}>52.000đ</Text>
                </View>
                <View style={styles.labelStyle}>
                    <Text style={styles.labelLeft}>Khuyến Mãi</Text>
                    <Text style={styles.labelRight}>0đ</Text>
                </View>
            </View>
            <View style={styles.deliveryContainer}>
                <View style={styles.labelStyle}>
                    <Text style={styles.labelLeft}>Phí giao dịch</Text>
                    <Text style={styles.labelRight}>Miễn phí</Text>
                </View>
            </View>
            <View style={styles.footerContainer}>
                <View style={styles.labelStyle}>
                    <Text style={styles.labelLeft}>Tổng tiền</Text>
                    <Text style={styles.labelTotal}>52.000đ</Text>
                </View>
            </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flex: 0.25
    },
    labelHeader: {
        fontSize: hp(3),
        fontWeight: 'bold',
        borderBottomColor: 'grey',
        borderBottomWidth: 0.7,
        padding: hp(2),
        paddingTop: hp(2.5)
    },
    bodyContainer: {
        flex: 0.4,
        justifyContent: 'center',
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginLeft: wp(5),
        marginRight: wp(5)
    },
    labelStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    labelLeft: {
        fontSize: hp(2),
        paddingBottom: hp(0.8),
        color: 'grey'
    },
    labelRight: {
        fontSize: hp(2),
        paddingBottom: hp(0.8)
    },
    deliveryContainer: {
        flex: 0.25,
        justifyContent: 'center',
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginLeft: wp(5),
        marginRight: wp(5)
    },
    footerContainer: {
        flex: 0.3,
        justifyContent: 'center',
        marginLeft: wp(5),
        marginRight: wp(5)
    },
    labelTotal: {
        fontSize: hp(3),
        fontWeight: 'bold'
    }

});

export default BillProfile;