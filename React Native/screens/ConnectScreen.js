import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    AsyncStorage,
    TouchableOpacity,
    Alert,
    Image
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ListItem } from 'react-native-elements';
import PercentageCircle from 'react-native-progress-circle';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Icon } from 'react-native-elements';
import Modal from "react-native-modal";
import { Feather } from '@expo/vector-icons';
import { Button } from 'react-native-elements';

import HeaderTitle from '../components/HeaderTitle';
import ReceiveElement from '../components/Connect/ReceiveElement';
import RankElement from '../components/Connect/RankElement';
import LightBox from '../components/LightBox'

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";

class ConnectScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userScore: 0,
            userScoreTotal: 0,
            userReward: 0,
            dealPoint: 0,
            isModalVisible: false,
            isModal2Visible: false,
            disableFirst: false,
            disableSecond: true,
            disableThird: true,
        };
    }

    async componentDidMount() {
        await this.getUserInfo();
        this.getDealPoint();
    }


    getUserInfo = async () => {
        try {
            const userId = await AsyncStorage.getItem('@userToken');
            const response = await fetch(ROOT + `/getuserinfobyid?userId=${userId}`);
            const jsonData = await response.json();
            this.setState({ userScore: jsonData[0].userScore })
            this.setState({ userScoreTotal: jsonData[0].userScoreTotal })
            this.setState({ userReward: jsonData[0].userReward })
        } catch (error) {
            console.log(error)
        }
    }

    async redeemReward() {
        const userId = await AsyncStorage.getItem('@userToken');
        if (this.state.dealPoint >= 50) {
            const minusPoint = this.state.dealPoint / 50 * 300
            const response = await fetch(ROOT + `/redeemreward?userScore=${this.state.userScore - minusPoint}&userId=${userId}&userReward=${this.state.userReward + this.state.dealPoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            this.setState({ dealPoint: 0 })
            this.setState({isModalVisible: false})
            const jsonData = await response.json();
            Alert.alert(
                'Chúc Mừng',
                'Bạn đã quy đổi điểm thành công',
                [
                    {
                        text: 'Xác nhận',
                        // onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    }
                ],
                { cancelable: false },
            );
        }
    }

    showLightBox = () => {
        this.setState({ isModalVisible: true })
    }

    handleButton = () => {
        this.setState({isModal2Visible: true})
    }

    handleLightBox = () => {
        this.setState({disableFirst: true})
        this.setState({isModal2Visible: false})
    }

    hideLightBox = () => {
        this.setState({ isModalVisible: false })
    }

    getDealPoint() {
        this.setState({ dealPoint: parseInt(this.state.userScore / 300) * 50 })
    }

    render() {
        return (
            <View style={styles.container}>
                <LightBox 
                    isModalVisible={this.state.isModal2Visible}
                    handleLightBox={() => this.handleLightBox()}
                />
                <Modal isVisible={this.state.isModalVisible}>
                    <View style={{ flex: 0.32, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' }}>
                        <View
                            style={{
                                height: hp(10),
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
                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: hp(1) }}>
                                <Text
                                    style={{
                                        fontFamily: 'Roboto-Regular',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        fontSize: hp(3),                                        
                                    }}
                                >Quy đổi</Text>
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
                            >Quy đổi {this.state.dealPoint / 50 * 300} điểm kết nối{'\n'}thành {this.state.dealPoint} điểm ưu đãi?</Text>
                        </View>
                        <View style={{
                            width: '90%'
                        }}
                        >
                            <Button
                                title='Xác nhận'
                                color={'#AE2070'}
                                onPress={() => this.redeemReward()}
                                buttonStyle={{ backgroundColor: '#AE2070', marginTop: hp(2) }}
                            />
                        </View>
                    </View>
                </Modal>
                <ScrollView>
                    <View style={styles.userStats}>
                        <ListItem
                            containerStyle={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
                            leftAvatar={{
                                source: require('../assets/avatars/avatar.png'),
                            }}
                            title={'NGUYỄN VĨ KHANG'}
                            rightElement={
                                <TouchableOpacity onPress={() => this.showLightBox()}>
                                    <ListItem
                                        containerStyle={styles.medalContainer}
                                        leftAvatar={{
                                            source: require('../assets/icons/medal.png')
                                        }}
                                        rightElement={
                                            <Text
                                                style={{
                                                    fontWeight: 'bold',
                                                    fontSize: hp(2.5),
                                                    marginLeft: wp(-5)
                                                }}
                                            >{this.state.dealPoint}</Text>
                                        }
                                    />
                                </TouchableOpacity>
                            }
                        />
                        <View style={styles.circleContainer}>
                            <PercentageCircle
                                radius={hp(14)}
                                percent={this.state.userScoreTotal / 10}
                                borderWidth={12}
                                color={"#FEA813"}
                            >
                                <Text style={{ fontSize: hp(1.8) }}>Tuần này</Text>
                                <View style={{ flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#C6CCD8', paddingBottom: 5 }}>
                                    {/* <MaterialCommunityIcons name="run" size={hp(3.5)} color="#D2D7E0" /> */}
                                    <Image source={require('../assets/icons/connect.png')} style={{marginHorizontal: wp(2), height: hp(3.5), width: wp(7) }} /> 
                                    <Text style={{ fontSize: hp(4), color: '#BC0076', fontWeight: 'bold' }}>{this.state.userScoreTotal}</Text>
                                </View>
                                <View style={{ paddingTop: 5 }}>
                                    <Text style={{ fontSize: hp(4) }}>1000</Text>
                                </View>
                            </PercentageCircle>
                        </View>
                        <View style={{ marginTop: hp(4), justifyContent: 'space-evenly', flexDirection: 'row' }}>
                            <ReceiveElement
                                first="Sử dụng mã kết"
                                second="nối sau 10' 3 lần"
                                one="Nhận mã ưu đãi"
                                two="trị giá 20.000đ"
                                onPress={() => this.handleButton()}
                                disabled={this.state.disableFirst}
                            />
                            <ReceiveElement
                                first="Sử dụng mã kết"
                                second="nối 10 lần"
                                one="Nhận mã ưu đãi"
                                two="trị giá 50.000đ"
                                onPress={() => this.handleButton()}
                                disabled={this.state.disableSecond}
                            />
                            <ReceiveElement
                                first="Gửi 20 mã kết nối"
                                second="thành công"
                                one="Nhận mã giảm"
                                two="giá trị 20.000đ"
                                onPress={() => this.handleButton()}
                                disabled={this.state.disableThird}
                            />
                        </View>
                        <View style={{ alignItems: 'center', marginTop: hp(2) }}>
                            <Text style={{ fontSize: hp(2), color: '#ADB0B7', borderTopWidth: 1, borderTopColor: '#C6CCD8', paddingVertical: hp(2) }} >Thức ăn dùng cho Heo Đất của bạn và sinh ra Heo {'\n'} Vàng để Quyên góp</Text>
                        </View>
                    </View>
                    <View style={styles.frequency}>
                        <View>
                            <LineChart
                                data={{
                                    labels: ["Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy", "Chủ nhật"],
                                    datasets: [
                                        // {
                                        //     data: [1, 2, 3, 4, 5, 6, 7],
                                        //     color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                                        // },
                                        {
                                            data: [1, 2, 3, 4, 5, 6, 7],
                                        }
                                    ]
                                }}
                                width={wp(96)} // from react-native
                                height={hp(40)}
                                // yAxisLabel={}
                                yAxisSuffix={" giờ"}
                                chartConfig={{
                                    backgroundColor: "#e26a00",
                                    backgroundGradientFrom: "#fb8c00",
                                    backgroundGradientTo: "#ffa726",
                                    decimalPlaces: 0, // optional, defaults to 2dp
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    style: {
                                        borderRadius: 10
                                    },
                                    propsForDots: {
                                        r: "6",
                                        strokeWidth: "2",
                                        stroke: "#ffa726"
                                    }
                                }}
                                bezier
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 10
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.rank}>
                        <View style={{ flexDirection: 'row', margin: hp(1) }}>
                            <Icon
                                name='torsos-all-female'
                                type='foundation'
                                iconStyle={{ marginHorizontal: wp(2) }}
                            />
                            {/* <Image source={require('../assets/icons/connect.png')} style={{marginHorizontal: wp(2), height: hp(3), width: wp(6) }} /> */}
                            <Text style={{ fontSize: hp(2.5), fontWeight: 'bold' }}>Bảng xếp hạng</Text>
                        </View>
                        <RankElement
                            source={require('../assets/icons/first_medal.jpg')}
                            name='LÊ DUY LUẬT'
                            numbers={956}
                        />
                        <RankElement
                            source={require('../assets/icons/second_medal.jpg')}
                            name='NGUYỄN THÀNH CÔNG'
                            numbers={720}
                        />
                        <RankElement
                            source={require('../assets/icons/third_medal.jpg')}
                            name='NGUYỄN VĨ KHANG'
                            numbers={365}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

ConnectScreen.navigationOptions = {
    headerTitle: <HeaderTitle title='Kết nối' />
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDEEEE',
        alignItems: 'center'
    },
    userStats: {
        flex: 0.7,
        backgroundColor: 'white',
        borderRadius: 10,
        width: wp(96),
        marginTop: hp(1.1),
        marginHorizontal: hp(1.1)
    },
    medalContainer: {
        backgroundColor: '#EFEFEF',
        borderRadius: 50
    },
    circleContainer: {
        alignItems: 'center'
    },
    frequency: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: wp(96),
        flex: 0.4,
        marginTop: hp(1.1),
        marginHorizontal: hp(1.1),
    },
    rank: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: wp(96),
        height: hp(40),
        marginBottom: hp(1.1),
        marginHorizontal: hp(1.1),
    }

});

export default ConnectScreen;