import React, { Component } from 'react'
import { Text, View, ImageBackground, Button } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from "react-native-modal";

export default class LightBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isModalVisible: false
        }
    }

    async componentWillReceiveProps () {
        await this.setState({isModalVisible: this.props.isModalVisible})
    }

    // componentWillUpdate() {
    //     this.setState({isModalVisible: this.props.isModalVisible})
    //     console.log('Hello')
    // }

    render() {
        return (
            <Modal isVisible={this.state.isModalVisible}>
                <View style={{ flex: 0.5, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' }}>
                    <ImageBackground
                        source={require('../assets/images/light-box-bg.png')}
                        style={{
                            height: hp(25),
                            width: '100%',
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text
                                style={{
                                    fontFamily: 'Roboto-Regular',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    fontSize: hp(3),
                                }}
                            >Chúc mừng, bạn đã{'\n'}hoàn thành thử thách!</Text>
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
                        >Bạn nhận được ưu đãi</Text>
                        <Text
                            style={{
                                fontSize: hp(2.5),
                                textAlign: 'center',
                                fontFamily: 'Roboto-Regular',
                                marginVertical: hp(2)
                            }}
                        >Giảm 20.000 khi thanh toán trên{'\n'} Google Play</Text>
                    </View>
                    <View style={{
                        width: '90%'
                    }}
                    >
                        <Button
                            title='Xác Nhận'
                            color={'#AE2070'}
                            onPress={this.props.handleLightBox}
                        />
                    </View>
                </View>
            </Modal>
        )
    }
}
