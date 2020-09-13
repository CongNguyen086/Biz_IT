import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import ReviewElement from '../StoreProfile/ReviewElement';
import config from '../../constants/config';
import Colors from '../../constants/Colors'
import ReviewData from '../../utils/ReviewData'

class Review extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            reviews: ReviewData,
            // reviews: [],
        }
    }
    componentDidMount() {
        // this.getReviewData(this.props.storeId)
    }
    getReviewData = async (storeId) => {
        this.setState({
            loading: true,
        })
        const response = await fetch(config.ROOT + `/getreview?storeId=${storeId}`);
        const jsonData = await response.json();
        this.setState({
            loading: false,
            reviews: jsonData
        })
    }

    render() {
        const {loading, reviews} = this.state
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <FontAwesome name='star' size={30} color='#feca57' style={styles.headerIcon} />
                    <Text style={styles.headerLabel}>Store rating</Text>
                </View>
                {loading && (
                    <View style={styles.loadingView}>
                        <ActivityIndicator size='large' color={Colors.momoColor} />
                    </View>
                )}
                {!loading && reviews.length === 0 && (
                    <View style={[styles.reviewElementContainer, styles.noReviewContainer]}>
                        <Text style={styles.noReviewText}>
                            {`No rating.\nPlease rate us for better services`}
                        </Text>
                    </View>
                )}
                {!loading && reviews.length > 0 && (
                    <View style={styles.reviewElementContainer}>
                        <FlatList
                            data={reviews.reverse()}
                            renderItem={({ item }) => 
                                <ReviewElement 
                                    review={item}
                                />}
                            keyExtractor={(item) => `${item.id}`}
                        />
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 60,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E9E9',
        alignItems: 'center',
    },
    headerIcon: {
        padding: hp(1.6)
    },
    headerLabel: {
        fontSize: hp(2.5),
    },
    loadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reviewElementContainer: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: 'grey'
    },
    noReviewContainer: {
        marginTop: 25,
    },
    noReviewText: {
        fontSize: hp(2),
        color: Colors.extraText,
        textAlign: 'center'
    },
});

export default Review;