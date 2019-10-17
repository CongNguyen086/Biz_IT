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
        backgroundColor: 'white',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
    },
    review: {
        flex: 0.5,
        backgroundColor: 'white',
        marginTop: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        
        shadowColor: "#000",
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 10,
    },
});

export default StoreProfile;