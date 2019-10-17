import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    FlatList,
    AsyncStorage,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-elements'

import Layout from '../constants/Layout'

const width = Layout.width;
const height = Layout.height;


import HeaderTitle from '../components/HeaderTitle';
import Colors from '../constants/Colors';
import MemberList from '../components/SendCode/MemberList';
import ListElement from '../components/SendCode/ListElement';
import sendCodeData from '../utils/sendCodeData';

class SendCodeScreen extends Component {
    static navigationOptions = {
        headerTitle: <HeaderTitle title='Tạo Nhóm' />,
    };
    constructor(props) {
        super(props)
        this.state = {
            friendList: [],
            radio: 'md-radio-button-off'
        }
    }

    // getStatus = async () => {
    //     try {
    //         if (radio == 'md-radio-button-off') {
    //             const newFriend = JSON.parse(await AsyncStorage.getItem('friendList'))
    //             newFriend.push(props.name)
    //             console.log(newFriend)
    //             await AsyncStorage.setItem('friendList', JSON.stringify(newFriend))
    //             this.setState({ radio: 'md-radio-button-on' })
    //         } else setRadio('md-radio-button-off')
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    componentDidMount = async () => {
        const list = await AsyncStorage.getItem('friendList')
    }

    inviteFriend() {
        Alert.alert('Xác nhận', 'Lời mời đã được gửi đến bạn bè của bạn')
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <Ionicons name='ios-search' size={20} color='grey' style={styles.icon} />
                    <TextInput placeholder='Nhập tên hoặc số điện thoại' style={styles.input} />
                </View>
                <View style={styles.addContainer}>
                    <View style={styles.invited}>
                        <FlatList
                            data={this.state.friendList}
                            renderItem={({ item }) => <MemberList name={item} />}
                            keyExtractor={item => item}
                            horizontal={true}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button type='solid'
                            title='Rủ ngay'
                            buttonStyle={styles.button}
                            titleStyle={{ fontSize: 18 }}
                            onPress={() => this.inviteFriend()} />
                    </View>
                </View>
                <View style={styles.listContainer} >
                    <FlatList
                        data={sendCodeData}
                        renderItem={({ item }) =>
                            <ListElement
                                name={item.name}
                                phone={item.phone}
                            />
                        }
                        keyExtractor={item => item.name}
                    />
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
    searchContainer: {
        flex: 0.1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        paddingLeft: 22,
        paddingBottom: 13,
        paddingTop: 13,
        flex: 0.1,
        backgroundColor: 'white',
        marginLeft: 17,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    input: {
        flex: 0.9,
        width: width,
        height: 46,
        backgroundColor: 'white',
        marginRight: 17,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        fontSize: 20
    },
    addContainer: {
        flex: 0.2,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
    },
    invited: {
        flex: 0.7
    },
    buttonContainer: {
        flex: 0.3,
        justifyContent: 'center',
        marginHorizontal: 25,
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
    member: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
    },
    butonStyle: {
        flex: 0.3,
        marginRight: 10
    },
    listContainer: {
        flex: 0.7,
        marginTop: 22,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
});

export default SendCodeScreen;