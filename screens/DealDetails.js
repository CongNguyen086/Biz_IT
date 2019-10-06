import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Alert,
} from 'react-native';
import { Icon } from 'react-native-elements'

import HeaderTitle from '../components/HeaderTitle';
import Colors from '../constants/Colors';

import DealInfo from '../components/DealDetails/DealInfo';
import StoreList from '../components/DealDetails/StoreList';

import { getDistance } from 'geolib';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

class DealDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            latitude: null,
            longitude: null,
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        if (Platform.OS === 'android' && !Constants.isDevice) {
            Alert.alert('This will not work on Sketch in an Android emulator. Try it on your device!')
        } else {
            this.getPosition();
            this.getStoreDealList(navigation.getParam('info', 'No info'));
            // console.log()
        }
    }

    getStoreDealList = async () => {
        const { navigation } = this.props;
        const passedData = navigation.getParam('info', 'No info');
        const response = await fetch(`http://192.168.1.15:3000/getstorepromotion?dealId=${passedData.dealId}`)
        const jsonData = await response.json();
        this.setState({ data: jsonData });
    }

    getPosition = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied')
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });
    };

    storeInSort = (topServiceId) => {
        const { data } = this.state;
        let fullList = data;

        // Sort data by distance
        // this.sortData(fullList);
        // fullList.sort((a, b) => {
        //     console.log(a.latitude)
        //     const aDist = getDistance(
        //         {
        //             latitude: a.latitude,
        //             longitude: a.longitude
        //         },
        //         {
        //             latitude: this.state.latitude,
        //             longitude: this.state.longitude
        //         }
        //     )

        //     const bDist = getDistance(
        //         {
        //             latitude: b.latitude,
        //             longitude: b.longitude
        //         },
        //         {
        //             latitude: this.state.latitude,
        //             longitude: this.state.longitude
        //         }
        //     )
        //     // a.distance = aDist
        //     // b.distance = bDist
        //     return aDist - bDist;
        // })
        // console.log(data)

        // const aDist = getDistance(
        //     {
        //         latitude: data[0].latitude,
        //         longitude: data[1].longitude
        //     },
        //     {
        //         latitude: this.state.latitude,
        //         longitude: this.state.longitude
        //     }
        // )

        // Move the top store of Top Service list to top of full list
        let top = fullList.find(store => store.serviceId == topServiceId);
        let sortedStoreList = fullList.sort((x, y) => { return x == top ? -1 : y == top ? 1 : 0; });
        console.log(top)
        return sortedStoreList;
    }

    // Sort data by distance
    // sortData(data) {
    //     data.sort((a, b) => {
    //         const aDist = getDistance(
    //             {
    //                 latitude: a.latitude,
    //                 longitude: a.longitude
    //             },
    //             {
    //                 latitude: this.state.latitude,
    //                 longitude: this.state.longitude
    //             }
    //         )
    //         console.log(aDist)
    //         const bDist = getDistance(
    //             {
    //                 latitude: b.latitude,
    //                 longitude: b.longitude
    //             },
    //             {
    //                 latitude: this.state.latitude,
    //                 longitude: this.state.longitude
    //             }
    //         )
    //         a.distance = aDist
    //         b.distance = bDist
    //         return aDist - bDist;
    //     })
    // }

    static navigationOptions = {
        headerTitle: <HeaderTitle title='Ưu đãi' />,
    };

    render() {
        const { navigation } = this.props;
        const passedData = navigation.getParam('info', 'No info');
        return (
            <View style={styles.container}>
                <View style={styles.dealInfo}>
                    <DealInfo />
                </View>
                <View style={styles.filterView}>
                    <Icon name='filter' type='font-awesome' color={Colors.extraText} />
                    <Text style={styles.filter}>Bộ lọc</Text>
                    <Icon name='angle-down' type='font-awesome' size={17} color={Colors.extraText} />
                </View>
                <View style={styles.storeList}>
                    <StoreList data={this.storeInSort(passedData.topServiceId)} />
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
    dealInfo: {
        flex: 0.32,
        // borderWidth: 1,
        // borderColor: 'black',
    },
    filterView: {
        flex: 0.07,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 15,
    },
    filter: {
        fontSize: 15,
        color: Colors.extraText,
        marginHorizontal: 5,
    },
    storeList: {
        flex: 0.65,
    },
});

export default DealDetails;