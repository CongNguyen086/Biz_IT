import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
// import { Rating, Icon, Button } from 'react-native-elements'

import ReviewElement from '../StoreProfile/ReviewElement';
import ReviewData from '../../utils/ReviewData';

class Review extends Component {
    render() {
        const { name, star, address, distance } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <FontAwesome name='star' size={30} color='grey' style={styles.headerIcon} />
                    <Text style={styles.headerLabel}>Đánh giá cửa hàng</Text>
                </View>
                <View style={styles.reviewElementContainer}>
                    <FlatList 
                    data={ReviewData}
                    renderItem={({item}) => <ReviewElement name={item.name} star={item.star} comment={item.comment} link={{uri: item.link}}/>}
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
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
        // borderTopLeftRadius: 10,
        // borderTopRightRadius: 10,
    },
    header: {
        flex: 0.2,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E9E9',
        alignItems: 'center'
    },
    headerIcon: {
        padding: 16
    },
    headerLabel: {
        fontSize: 20,
    },
    reviewElementContainer: {
        flex: 0.8,
        borderBottomWidth: 1,
        borderBottomColor: 'grey'
    }
});

export default Review;