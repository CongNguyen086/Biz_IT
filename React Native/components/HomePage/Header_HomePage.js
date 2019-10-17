import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { withNavigation } from 'react-navigation';
//Component
import Search_HomePage from './Search_HomePage'

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

function Header_HomePage(props) {
    return (
        <View style={styles.container}>
            <ImageBackground style={styles.header} source={require('../../assets/Header_HomePage/leaves.jpg')}>
                <View style={styles.searchContainer} opacity={0.7}>
                    <Search_HomePage />
                    <TouchableOpacity>
                        <MaterialCommunityIcons name='bell-ring-outline' size={25} color="white" style={{ opacity: 1 }} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialCommunityIcons name='power' size={25} color="white" style={{ marginRight: 10, opacity: 1 }} />
                    </TouchableOpacity>
                </View>
                <View style={styles.toolsContainer}>
                    <TouchableOpacity style={styles.tool}>
                        <Image source={require('../../assets/Header_HomePage/deposit.png')} style={styles.imageTools} />
                        <Text style={styles.toolLabel}>NẠP TIỀN {'\n'}VÀO VÍ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tool}>
                        <Image source={require('../../assets/Header_HomePage/withdraw.png')} style={styles.imageTools} />
                        <Text style={styles.toolLabel}>RÚT TIỀN {'\n'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tool} onPress={() => props.navigation.navigate('Payment')}>
                        <Image source={require('../../assets/Header_HomePage/qrCode.png')} style={styles.imageTools} />
                        <Text style={styles.toolLabel}>MÃ {'\n'}THANH TOÁN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tool}>
                        <Image source={require('../../assets/Header_HomePage/scan.png')} style={styles.imageTools} />
                        <Text style={styles.toolLabel}>QUÉT MÃ {'\n'}</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            <View style={styles.amountContainer}>
                <View>
                    <MaterialCommunityIcons name='eye-outline' size={20} color="white" style={{ marginLeft: 10 }} color="gray" />
                    <Text style={{ color: 'gray', marginLeft: 10 }}>Số dư trong ví</Text>
                </View>
                <View style={styles.amountMoney}>
                    <Text style={{ fontSize: 28, marginRight: 10 }} >7.200đ</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    header: {
        flex: 0.7,
        height: '100%',
        width: '100%',
    },
    searchContainer: {
        flex: 1.5 / 4,
        height: 50,
        width: width,
        backgroundColor: '#325340',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    toolsContainer: {
        flex: 2.5 / 4,
        justifyContent: 'space-around',
        flexDirection: 'row'
    },
    toolLabel: {
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        fontSize: 12
    },
    tool: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageTools: {
        height: 35,
        width: 35,
    },
    amountContainer: {
        flex: 0.3,
        backgroundColor: 'white',
        width: width,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        //shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
});

export default withNavigation(Header_HomePage)
