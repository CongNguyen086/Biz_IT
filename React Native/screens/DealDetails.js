import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Alert
} from 'react-native';
import { Icon } from 'react-native-elements'
import { getDistance } from 'geolib';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// Constants
import HeaderTitle from '../components/HeaderTitle';
import Colors from '../constants/Colors';
import ROOT from '../constants/Root';
// Components
import DealInfo from '../components/DealDetails/DealInfo';
import StoreList from '../components/DealDetails/StoreList';

class DealDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            latitude: null,
            longitude: null,
        }
        passedData = this.props.navigation.getParam('info', 'No info');
    }

    async componentDidMount() {
        await this.getPosition();
        await this.getStoreDealList();
        this.storeInSort();
    }

    getStoreDealList = async () => {
        // const passedData = navigation.getParam('info', 'No info');
        const response = await fetch(ROOT + `/getstorepromotion?dealId=${passedData.dealId}`)
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
        }, () => console.log('Current location: ', location.coords));
    };

    storeInSort = async () => {
        const { data } = this.state;

        this.sortData(data);

        // Move the top store of Top Service list to top of full list
        let top = await data.find(store => store.serviceId == passedData.topServiceId);
        let sortedStoreList = data.sort((x, y) => { return x == top ? -1 : y == top ? 1 : 0; });
        console.log(passedData.topServiceId)
        this.setState({ data: sortedStoreList })
    }

    // Sort data by distance
    sortData(data) {
        data.sort((a, b) => {
            const aDist = getDistance(
                {
                    latitude: a.latitude,
                    longitude: a.longitude
                },
                {
                    latitude: this.state.latitude,
                    longitude: this.state.longitude
                }
            )
            const bDist = getDistance(
                {
                    latitude: b.latitude,
                    longitude: b.longitude
                },
                {
                    latitude: this.state.latitude,
                    longitude: this.state.longitude
                }
            )
            a.distance = aDist
            b.distance = bDist
            return aDist - bDist;
        })
    }

    static navigationOptions = {
        headerTitle: <HeaderTitle title='Ưu đãi' />,
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.dealInfo}>
                    <DealInfo 
                        image={{ uri: passedData.image}}
                    />
                </View>
                <View style={styles.filterView}>
                    <Icon name='filter' type='font-awesome' color={Colors.extraText} />
                    <Text style={styles.filter}>Bộ lọc</Text>
                    <Icon name='angle-down' type='font-awesome' size={17} color={Colors.extraText} />
                </View>
                <View style={styles.storeList}>
                    <StoreList 
                        data={this.state.data}
                        categoryId={passedData.categoryId}
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
    dealInfo: {
        flex: 0.35,
    },
    filterView: {
        flex: 0.07,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: wp(3),
    },
    filter: {
        fontSize: hp(2),
        color: Colors.extraText,
        marginHorizontal: wp(2),
    },
    storeList: {
        flex: 0.65,
    },
});

export default DealDetails;