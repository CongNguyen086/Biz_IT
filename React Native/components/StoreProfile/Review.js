import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import ReviewElement from '../StoreProfile/ReviewElement';
import ROOT from '../../constants/Root';

class Review extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reviewData: [],
        }
    }
    componentDidMount () {
        this.getReviewData(this.props.storeId)
    }
    getReviewData = async (storeId) => {
        const response = await fetch(ROOT + `/getreview?storeId=${storeId}`);
        const jsonData = await response.json();
        this.setState({ reviewData: jsonData })
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <FontAwesome name='star' size={hp(4)} color='grey' style={styles.headerIcon} />
                    <Text style={styles.headerLabel}>Đánh giá cửa hàng</Text>
                </View>
                <View style={styles.reviewElementContainer}>
                    <FlatList
                        data={this.state.reviewData.reverse()}
                        renderItem={({ item }) => <ReviewElement name={item.fullName} star={item.reviewRating} comment={item.reviewComment} reviewId={item.reviewId} />}
                        keyExtractor={ (item, index) => index.toString() }
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
    },
    header: {
        flex: 0.2,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E9E9',
        alignItems: 'center'
    },
    headerIcon: {
        padding: hp(1.6)
    },
    headerLabel: {
        fontSize: hp(2.5),
    },
    reviewElementContainer: {
        flex: 0.8,
        borderBottomWidth: 1,
        borderBottomColor: 'grey'
    }
});

export default Review;