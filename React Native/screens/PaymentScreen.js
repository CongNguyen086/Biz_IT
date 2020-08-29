import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    AsyncStorage,
    Alert,
    TextInput,
    ImageBackground,
    Keyboard
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons';
import { Button } from 'react-native-elements';
import Modal from "react-native-modal";

import HeaderTitle from '../components/HeaderTitle';

class PaymentScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            receiverCash: 0,
            receiverCode: '',
            receiverScore: 0,
            receiverScoreTotal: 0,
            senderId: '',
            senderStoreId: '',
            senderTimestamps: '',
            senderScore: 0,
            senderScoreTotal: 0,
            senderCheckCode: true,
            qrcode: false,
            isDisableButton: false,
            isModalVisible: false,
            connectScore: 0
        };
    }

    static navigationOptions = {
        headerTitle: <HeaderTitle title='Thanh Toán' />,
    };

    getReceiverInfo = async () => {
        try {
            const userId = await AsyncStorage.getItem('@userToken');
            const response = await fetch(ROOT + `/getuserinfobyid?userId=${userId}`);
            const jsonData = await response.json();
            this.setState({ receiverCash: jsonData[0].userCash })
            this.setState({ receiverCode: jsonData[0].userCode })
            this.setState({ receiverScore: jsonData[0].userScore })
            this.setState({ receiverScoreTotal: jsonData[0].userScoreTotal })
        } catch (error) {
            console.log(error)
        }
    }

    componentDidMount() {
        this.getReceiverInfo();
    }

    confirmPaymentSecond = async (storeId) => {
        const userId = await AsyncStorage.getItem('@userToken');
        await this.applyscore(userId, storeId);
        await this.putSender();
    }

    confirmPayment = async (storeId) => {
        try {
            this.setState({ receiverCash: this.state.receiverCash - 52000 })

            console.log('userCash: ' + this.state.receiverCash)
            const userId = await AsyncStorage.getItem('@userToken');
            const response = await fetch(ROOT + `/putusercash?cash=${this.state.receiverCash}&userId=${userId}`, {
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

    checkCode = async () => {
        try {
            const response = await fetch(ROOT + `/getuserinfobycode?userCode=${this.state.text}`);
            const jsonData = await response.json();
            if (jsonData[0] != null) {
                this.setState({ senderId: jsonData[0].userId })
                this.setState({ senderStoreId: jsonData[0].userStoreId })
                this.setState({ senderTimestamps: jsonData[0].userTimestamps })
                this.setState({ senderScore: jsonData[0].userScore })
                this.setState({ senderScoreTotal: jsonData[0].userScoreTotal })
            }
            else {
                Alert.alert(
                    'Mã không hợp lệ',
                    'Xin vui lòng nhập lại',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        }
                    ],
                    { cancelable: false },
                );
            }
        } catch (error) {
            console.log(error)
        }
    }

    // checkStore = async (storeId) => {
    //     if (this.state.senderStoreId == storeId) {
    //         this.checkUserId();
    //     }
    //     else {
    //         Alert.alert(
    //             'Cửa hàng không đúng',
    //             'Xin vui lòng nhập lại',
    //             [
    //                 {
    //                     text: 'Cancel',
    //                     onPress: () => console.log('Cancel Pressed'),
    //                     style: 'cancel',
    //                 }
    //             ],
    //             { cancelable: false },
    //         );
    //     }
    // }

    pushNotification = async (userId, title, body) => {
        try {
            await fetch(ROOT + `/pushnotification?userId=${userId}&title=${title}&body=${body}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: 'khang',
                    class: 'GCS0705B',
                }),
            });
        } catch (error) {
            console.log(error)
        }
    }

    checkUserId = async () => {
        const userId = await AsyncStorage.getItem('@userToken');
        if (userId != this.state.senderId) {
            // this.applyscore(userId);
            // this.putSender();
            this.setState({ qrcode: true })
        }
        else {
            Alert.alert(
                'Bạn không thể tự nhập mã của mình vào',
                'Xin vui lòng nhập lại',
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    }
                ],
                { cancelable: false },
            );
        }
    }

    postCheckCode = async (userId, userCode) => {
        const response = await fetch(ROOT + `/postcheckcode?userId=${userId}&userCode=${userCode}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const jsonData = await response.json();
        return jsonData;
    }

    getCheckCode = async (userId) => {
        const response = await fetch(ROOT + `/getcheckcode?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const jsonData = await response.json();
        jsonData.forEach(element => {
            if (element.applyCode == this.state.text) {
                this.setState({ senderCheckCode: false })
            }
        })
    }
    changeQRCode = (storeId) => {
        if (this.state.qrcode == false) {
            return (
                <TouchableOpacity style={styles.bodyContainer} onPress={() => this.confirmPayment(storeId)}>
                    <Image source={require('../assets/images/bodyPayment.png')} style={styles.bodyImage} />
                </TouchableOpacity>
            )
        }
        else if (this.state.qrcode == true) {
            return (
                <TouchableOpacity style={styles.bodyContainer} onPress={() => this.confirmPaymentSecond(storeId)}>
                    <Image source={require('../assets/images/newQRCode.png')} style={styles.bodyImage} />
                </TouchableOpacity>
            )
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

    applyscore = async (userId, storeId) => {
        await this.getReceiverInfo()
        await this.getCheckCode(userId)
        if (this.state.senderCheckCode == false) {
            Alert.alert(
                'Bạn mã này bạn đã nhập rồi',
                'Xin vui lòng nhập lại',
                [
                    {
                        text: 'OK',
                        style: 'cancel',
                    }
                ],
                { cancelable: false },
            );
        }
        else {
            let timestamps_before = this.state.senderTimestamps
            let timestamps_now = new Date().getTime()
            let time = timestamps_now - timestamps_before

            if (time <= 60000 * 10) {
                this.setState({ receiverScore: this.state.receiverScore + 100 })
                this.setState({ receiverScoreTotal: this.state.receiverScoreTotal + 100 })
                this.putSender(this.putUserScore(userId, this.state.receiverScore, this.state.receiverScoreTotal))
                this.postCheckCode(userId, this.state.text)
                this.pushNotification(this.state.senderId, 'Hello', 'đã đến địa của bạn và xác nhận thanh toán thành công và bạn nhận dc 30 điểm kết nối')
                this.setState({ isModalVisible: true })
                this.setState({ connectScore: 100 })
                this.confirmPayment(storeId)
            }
            else if (time <= 60000 * 30) {
                this.setState({ receiverScore: this.state.receiverScore + 50 })
                this.setState({ receiverScoreTotal: this.state.receiverScoreTotal + 50 })
                this.putSender(this.putUserScore(userId, this.state.receiverScore, this.state.receiverScoreTotal))
                this.postCheckCode(userId, this.state.text)
                this.pushNotification(this.state.senderId, 'Hello', 'đã đến địa của bạn và xác nhận thanh toán thành công và bạn nhận dc 30 điểm kết nối')
                this.setState({ isModalVisible: true })
                this.setState({ connectScore: 50 })
                this.confirmPayment(storeId)
            }
            else if (time <= 60000 * 60) {
                this.setState({ receiverScore: this.state.receiverScore + 25 })
                this.setState({ receiverScoreTotal: this.state.receiverScoreTotal + 25 })
                this.putSender(this.putUserScore(userId, this.state.receiverScore, this.state.receiverScoreTotal))
                this.postCheckCode(userId, this.state.text)
                this.pushNotification(this.state.senderId, 'Hello', 'đã đến địa của bạn và xác nhận thanh toán thành công và bạn nhận dc 30 điểm kết nối')
                this.setState({ isModalVisible: true })
                this.setState({ connectScore: 25 })
                this.confirmPayment(storeId)
            }
        }
    }

    hideLightBox = () => {
        this.setState({ isModalVisible: false })
    }

    putSender = async (senderData) => {
        if (senderData != null) {
            // await this.setState({ senderScore: this.state.senderScore + 10 })
            // await this.setState({ senderScoreTotal: this.state.senderScoreTotal + 10 })
            await this.putUserScore(this.state.senderId, this.state.senderScore + 10, this.state.senderScoreTotal + 10)
        }
    }

    applyCode = async () => {
        await this.checkCode();
        await this.checkUserId();
        this.setState({ isDisableButton: true })
        Keyboard.dismiss();
    }

    render() {
        const storeId = this.props.navigation.getParam('storeId', 0);
        return (
            <View style={styles.container}>
                <Modal isVisible={this.state.isModalVisible}>
                    <View style={{ flex: 0.5, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' }}>
                        <ImageBackground
                            source={require('../assets/images/light-box-bg.png')}
                            style={{
                                height: hp(25),
                                width: '100%',
                                borderRadius: 10
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => this.hideLightBox()}
                                style={{
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-end',
                                    marginRight: hp(1),
                                    marginTop: hp(1)
                                }}>
                                <Feather name="x" size={32} />
                            </TouchableOpacity>
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: hp(5) }}>
                                <Text
                                    style={{
                                        fontFamily: 'Roboto-Regular',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        fontSize: hp(3),
                                    }}
                                >Chúc mừng bạn nhận được {this.state.connectScore}{'\n'}điểm kết nối</Text>
                            </View>
                        </ImageBackground>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text
                                style={{
                                    fontSize: hp(3),
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    color: '#AE2070',
                                    fontFamily: 'Roboto-Regular'
                                }}
                            >Chia sẻ ngay - nhận điểm liền tay</Text>
                            <Text
                                style={{
                                    fontSize: hp(2.5),
                                    textAlign: 'center',
                                    fontFamily: 'Roboto-Regular',
                                    marginVertical: hp(2)
                                }}
                            >Chia sẻ lên facebook và nhận 20 điểm {'\n'} kết nối ngay</Text>
                        </View>
                        <View style={{
                            width: '90%'
                        }}
                        >
                            <Button
                                title='Chia sẻ ngay!!'
                                color={'#AE2070'}
                                onPress={() => this.hideLightBox()}
                                buttonStyle={{ backgroundColor: '#AE2070' }}
                            />
                        </View>
                    </View>
                </Modal>
                <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginTop: hp(4) }}>
                    <TextInput
                        style={{
                            backgroundColor: '#F5F5F5',
                            height: hp(5),
                            width: wp(60),
                            borderRadius: 6,
                            textAlign: 'center',
                            fontWeight: 'bold'
                        }}
                        editable
                        maxLength={20}
                        placeholder='Nhập mã kết nối của bạn'
                        ref={input => { this.textInput = input }}
                        onChangeText={(text) => this.setState({ text })}
                        value={this.state.text}
                    />
                    <Button type='solid'
                        title='Áp dụng'
                        buttonStyle={styles.button}
                        titleStyle={{ fontSize: hp(2) }}
                        onPress={() => this.applyCode()}
                        disabled={this.state.isDisableButton}
                    />
                </View>
                <View style={styles.headerContainer}>
                    <Image source={require('../assets/images/headerPayment.png')} style={styles.headerImage} />
                </View>
                {/* <TouchableOpacity style={styles.bodyContainer} onPress={() => this.confirmPayment(storeId)}>
                    <Image source={require('../assets/images/bodyPayment.png')} style={styles.bodyImage} />
                </TouchableOpacity>  */}
                {this.changeQRCode(storeId)}
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
        backgroundColor: 'transparent',
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
        alignItems: 'center',
        marginTop: hp(6)
    },
    bodyImage: {
        width: wp(50),
        height: hp(25)
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
    },
    button: {
        marginLeft: wp(3),
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

export default PaymentScreen;