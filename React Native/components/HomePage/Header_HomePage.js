import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { withNavigation } from 'react-navigation';
//Component
import Search_HomePage from './Search_HomePage'

function Header_HomePage(props) {
    return (
        <View style={styles.container}>
            <ImageBackground style={styles.header} source={require('../../assets/Header_HomePage/leaves.jpg')}>
                <View style={styles.searchContainer} opacity={0.7}>
                    <Search_HomePage />
                    <TouchableOpacity>
                        <MaterialCommunityIcons name='bell-ring-outline' size={hp(3)} color="white" style={{ opacity: 1 }} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialCommunityIcons name='power' size={hp(3)} color="white" style={{ marginRight: wp(3), opacity: 1 }} />
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
            <View style={styles.rewardContainer}>
                <View style={{flexDirection: 'row', borderRadius: 5, borderWidth: 0.5, padding: hp(1), alignItems: 'center', justifyContent: 'center', borderColor: '#B0B0B0'}}>
                    <Image source={require('../../assets/icons/iconDealScore.png')}  style={{ height: hp(3), width: wp(6), marginRight: wp(3) }}/>
                    <Text style={{fontSize: hp(2.5), fontWeight: 'bold'}}>{props.userReward}</Text>
                    <Text style={{fontSize: hp(2.5)}} > điểm</Text>
                    <AntDesign name='right' size={hp(2)} color="#B0B0B0" style={{ marginLeft: wp(6.7) }} />
                </View>
                <View style={{flexDirection: 'row', borderRadius: 5, borderWidth: 0.5, padding: hp(1), alignItems: 'center', justifyContent: 'center', borderColor: '#B0B0B0'}}>
                    <Image source={require('../../assets/icons/iconGift.png')}  style={{ height: hp(3), width: wp(6), marginRight: wp(3) }}/>
                    <Text style={{fontSize: hp(2.5)}}>Quà của tôi</Text>
                    <AntDesign name='right' size={hp(2)} color="#B0B0B0" style={{ marginLeft: wp(6.7) }} />
                </View>
            </View>
            <View style={styles.amountContainer}>
                <View>
                    <MaterialCommunityIcons name='eye-outline' size={hp(3)} color="white" style={{ marginLeft: wp(3) }} color="gray" />
                    <Text style={{ color: 'gray', marginLeft: wp(3) }}>Số dư trong ví</Text>
                </View>
                <View style={styles.amountMoney}>
                    <Text style={{ fontSize: hp(4), marginRight: wp(3) }} >{props.cash}đ</Text>
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
        width: wp(100),
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
        fontSize: hp(1.5)
    },
    tool: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageTools: {
        height: hp(4.2),
        width: hp(4.2),
    },
    amountContainer: {
        flex: 0.3,
        backgroundColor: 'white',
        width: wp(100),
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: hp(1),
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
    rewardContainer: {
        flex: 0.4,
        backgroundColor: 'white',
        width: wp(100),
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
});

export default withNavigation(Header_HomePage)
