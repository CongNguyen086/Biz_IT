import React, { Component } from 'react';
import { StyleSheet, View, Share, AsyncStorage, ScrollView, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import ReviewProfile from '../components/AfterPayment/ReviewProfile';
import BillProfile from '../components/AfterPayment/BillProfile';

import HeaderTitle from '../components/HeaderTitle';
import Colors from '../constants/Colors';
import Modal from "react-native-modal";

class AfterPaymentScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            randomCode: '',
            storeId: '',
            storeAddress: '',
            userScore: 0,
            userScoreTotal: 0,
            isShared: false,
            isModalVisible: false

        }
    }
    static navigationOptions = {
        headerTitle: <HeaderTitle title='Thanh Toán' />,
    };

    async componentDidMount() {
        await this.setState({ randomCode: Math.random().toString(36).substr(2, 10) })
        await this.setState({ storeId: this.props.navigation.getParam('storeId', 0) })
        await this.getStoreAddress(this.state.storeId)
        await this.getUserInfo();
    }

    getStoreAddress = async (storeId) => {
        try {
            const response = await fetch(ROOT + `/getstoreaddress?storeId=${storeId}`);
            const jsonData = await response.json();
            this.setState({ storeAddress: jsonData[0].storeAddress })
        } catch (error) {
            console.log(error)
        }
    }

    updateUserCode = async (userId) => {
        const response = await fetch(ROOT + `/putusercode?userCode=${this.state.randomCode}&storeId=${this.state.storeId}&userId=${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const jsonData = await response.json();
        // console.log(jsonData);
    }

    getUserInfo = async () => {
        try {
            const userId = await AsyncStorage.getItem('@userToken');
            const response = await fetch(ROOT + `/getuserinfobyid?userId=${userId}`);
            const jsonData = await response.json();
            this.setState({ userScore: jsonData[0].userScore })
            this.setState({ userScoreTotal: jsonData[0].userScoreTotal })
        } catch (error) {
            console.log(error)
        }
    }

    putUserScore = async (userId, userScore, userScoreTotal) => {
        const response = await fetch(ROOT + `/applyscore?userScore=${userScore}&userId=${userId}&userScoreTotal=${userScoreTotal}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const jsonData = await response.json();
        return jsonData;
    }

    hideLightBox = () => {
        this.setState({ isModalVisible: false })
    }

    onShare = async () => {
        const token = await AsyncStorage.getItem('@userToken');
        this.updateUserCode(token);
        try {
            const result = await Share.share({
                title: 'Hello',
                message: this.state.randomCode + '. Hãy nhập mã khuyến mãi này tại ' + this.state.storeAddress + ' để tham gia cuộc vui cùng tôi và nhận những ưu đãi hấp dẫn khi thanh toán nhé.'
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('one');
                } else {
                    if (this.state.isShared == false) {
                        this.putUserScore(token, this.state.userScore + 30, this.state.userScoreTotal + 30)
                        this.setState({ isModalVisible: true })
                        this.setState({ isShared: true })
                    }
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('three')
            }
        } catch (error) {
            alert(error.message);
        }
    };

    render() {
        const storeId = this.props.navigation.getParam('storeId', 0);
        return (
            <View style={styles.container}>
                <Modal isVisible={this.state.isModalVisible}>
                    <View style={{ flex: 0.32, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' }}>
                        <View
                            style={{
                                height: hp(10),
                                width: '100%',
                                borderRadius: 10
                            }}
                        >
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: hp(3) }}>
                                <Text
                                    style={{
                                        fontFamily: 'Roboto-Regular',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        fontSize: hp(3),
                                    }}
                                >Chúc Mừng</Text>
                            </View>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text
                                style={{
                                    fontSize: hp(3),
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    color: '#828282',
                                    fontFamily: 'Roboto-Regular',
                                    marginTop: hp(2)
                                }}
                            >Bạn đã chia sẻ và nhận được 20 điểm kết nối</Text>
                        </View>
                        <View style={{
                            width: '90%',
                            marginTop: hp(3)
                        }}
                        >
                            <Button
                                title='Xác nhận'
                                color={'#AE2070'}
                                onPress={() => this.hideLightBox()}
                                buttonStyle={{ backgroundColor: '#AE2070' }}
                            />
                        </View>
                    </View>
                </Modal>
                <ScrollView>
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
                            buttonStyle={styles.buttonFirst}
                            titleStyle={{ fontSize: hp(2) }}
                            onPress={() => this.onShare()}
                        />
                        <Button type='solid'
                            title='Quay lại màn hình chính'
                            buttonStyle={styles.buttonSecond}
                            titleStyle={{ fontSize: hp(2), color: 'black' }}
                            onPress={() => this.props.navigation.navigate('HomePage')}
                        />
                    </View>
                </ScrollView>
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
        height: hp(50)
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
        height: hp(35)
    },
    buttonContainer: {
        flex: 0.1,
        justifyContent: 'center',
        marginHorizontal: wp(5),
    },
    buttonFirst: {
        marginTop: hp(1.5),
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
    buttonSecond: {
        marginVertical: hp(2),
        backgroundColor: '#C4C4C4',
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