import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Icon } from 'react-native-elements'

import HeaderTitle from '../components/HeaderTitle';
import Colors from '../constants/Colors';

import DealInfo from '../components/DealDetails/DealInfo';
import StoreList from '../components/DealDetails/StoreList';

class DealDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    static navigationOptions = {
        headerTitle: <HeaderTitle title='Ưu đãi' />,
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.dealInfo}>
                    <DealInfo />
                </View>
                <View style={styles.filterView}>
                    <Icon name='filter' type='font-awesome' color={Colors.extraText} />
                    <Text style={styles.filter}>Filter</Text>
                    <Icon name='angle-down' type='font-awesome' size={17} color={Colors.extraText} />
                </View>
                <View style={styles.storeList}>
                    <StoreList />
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