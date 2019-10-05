import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { Rating, Button } from 'react-native-elements'

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout'

const width = Layout.width;
const height = Layout.height;

class BillProfile extends Component {
    render() {
        const { name, star, address, distance } = this.props;
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
    header: {
        flex: 0.25
    },
    labelHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        padding: 20,
        paddingTop: 25
    },
    bodyContainer: {
        flex: 0.4,
        justifyContent: 'center',
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginLeft: 25,
        marginRight: 25
    },
    labelStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    labelLeft: {
        fontSize: 16,
        paddingBottom: 8,
        color: 'grey'
    },
    labelRight: {
        fontSize: 16,
        paddingBottom: 8
    },
    deliveryContainer: {
        flex: 0.25,
        justifyContent: 'center',
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        marginLeft: 25,
        marginRight: 25
    },
    footerContainer: {
        flex: 0.3,
        justifyContent: 'center',
        marginLeft: 25,
        marginRight: 25
    },
    labelTotal: {
        fontSize: 25,
        fontWeight: 'bold'
    }

});

export default BillProfile;