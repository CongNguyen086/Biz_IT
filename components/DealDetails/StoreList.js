import React, { Component } from 'react';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';
import { StoreInfo, Avatar  } from './StoreInfo';

const data = [
    {
        name: 'The Coffee House-D2',
        avatar: require('../../assets/avatars/TCH_avatar.png'),
        address: '157 Đường D2, Bình Thạnh',
        time: '123',
        star: '4,5',
        promotion: '20%',
        description: 'Hoàn tiền 20% trên tổng hóa đơn',
    },
    {
        name: 'The Coffee House-Quận 10',
        avatar: require('../../assets/avatars/TCH_avatar.png'),
        address: 'TCH',
        time: '123',
        star: '4,5',
        promotion: '20%',
        description: 'Hoàn tiền 20% trên tổng hóa đơn',
    },
    {
        name: 'Highlands-Sư Vạn Hạnh',
        avatar: require('../../assets/avatars/highlands_avatar.png'),
        address: 'TCH',
        time: '123',
        star: '4,5',
        promotion: '15%',
        description: 'Hoàn tiền 20% trên tổng hóa đơn',
    },
    {
        name: 'The Coffee House-D2',
        avatar: require('../../assets/avatars/TCH_avatar.png'),
        address: 'TCH',
        time: '123',
        star: '4,5',
        promotion: '20%',
        description: 'Hoàn tiền 20% trên tổng hóa đơn',
    },
    {
        name: 'Highlands-Sư Vạn Hạnh',
        avatar: require('../../assets/avatars/highlands_avatar.png'),
        address: 'TCH',
        time: '123',
        star: '4,5',
        promotion: '15%',
        description: 'Hoàn tiền 20% trên tổng hóa đơn',
    },
];

class StoreList extends Component {
    renderList = ({ item }) => (
        <ListItem
            containerStyle={styles.listItem}
            contentContainerStyle={{ flex:0.02 }}
            leftElement={<Avatar data={item} />}
            rightElement={<StoreInfo data={item} />}
            pad={3}
            onPress={() => {
                this.props.navigation.navigate('StoreProfile', {
                    info: item,
                })
            }}
        />
    );
    
    renderKeyExtractor = (item, index) => index.toString();
    
    renderSeparator = () => {
        return (
            <View style={styles.separator} />
        );
    };
    
    render() {
        return (
            <Card containerStyle={styles.container}>
                <FlatList
                    data={data}
                    renderItem={this.renderList}
                    keyExtractor={this.renderKeyExtractor}
                    ItemSeparatorComponent={this.renderSeparator}
                />
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        margin: -1,
        padding: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 10,
    },
    listItem: {
        flex: 1,
        height: 120,
    },
    separator: {
        height: 1,
        backgroundColor: "#E8E9E9",
    },
});

export default withNavigation(StoreList);