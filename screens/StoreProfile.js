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

import HeaderTitle from '../components/HeaderTitle';
import Colors from '../constants/Colors';

class StoreProfile extends Component {
    static navigationOptions = {
        headerTitle: <HeaderTitle title='Cafe/MilkTea' />,
    };

    render() {
        const { info } = this.props.navigation.state.params;
        const distance = '3km từ vị trí hiện tại'
        return(
            <View style={styles.container}>
                <View style={styles.storeProfile}>
                    <MainProfile name={info.name} 
                                star={info.star}
                                address={info.address}
                                distance={distance}  />
                </View>

                <View style={styles.review}>

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
    },
    review: {
        flex: 0.5,
    },
});

export default StoreProfile;