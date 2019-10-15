import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Dimensions,
    Alert,
    Image,
} from 'react-native';
import MainProfile from '../components/StoreProfile/MainProfile';
import Review from '../components/StoreProfile/Review'

import HeaderTitle from '../components/HeaderTitle';
import Colors from '../constants/Colors';

class StoreProfile extends Component {
    static navigationOptions = {
        headerTitle: <HeaderTitle title='Cafe/MilkTea' />,
    };

    render() {
        const info = this.props.navigation.getParam('info', 'No info');
        const distance = '3km từ vị trí hiện tại'
        return(
            <View style={styles.container}>
                <View style={styles.storeProfile}>
                    <MainProfile name={info.storeName} 
                                star={info.star}
                                address={info.storeAddress}
                                distance={distance}/>
                </View>
                <View style={styles.review}>
                    <Review />
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
    storeProfile: {
        flex: 0.5,
        backgroundColor: 'white'
    },
    review: {
        flex: 0.5,
        backgroundColor: 'white',
        marginTop: 20
    },
});

export default StoreProfile;