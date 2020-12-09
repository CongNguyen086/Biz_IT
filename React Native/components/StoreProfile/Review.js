import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {Input, Icon} from 'react-native-elements'

import ReviewElement from '../StoreProfile/ReviewElement';
import config from '../../constants/config';
import Colors from '../../constants/Colors'
import ReviewData from '../../utils/ReviewData'

class Review extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            reviewText: '',
            // reviews: ReviewData,
            reviews: [],
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
        console.log("🚀 ~ file: Review.js ~ line 30 ~ Review ~ getReviewData= ~ response", response)
        const jsonData = await response.json();
        this.setState({
            loading: false,
            reviews: jsonData
        })
    }

    onReviewMessageChanged = (text) => {
        this.setState({
            reviewText: text,
        })
    }

    onReviewSubmit = () => {
        Alert.alert('submit review')
    }

    render() {
        const {loading, reviews, reviewText} = this.state
        const {onReviewMessageChanged, onReviewSubmit} = this
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
                <View style={styles.chatContainer}>
                    <View style={{flex: 1}}>
                        <Input
                            value={reviewText}
                            onChangeText={onReviewMessageChanged}
                            inputContainerStyle={{
                                borderColor: '#ccc',
                                borderWidth: 1,
                                borderRadius: 30,
                            }}
                            inputStyle={{
                                paddingHorizontal: 20,
                            }}
                            placeholder='Tell us about this store'
                        />
                    </View>
                    <Icon 
                        name='send' 
                        type='material' 
                        size={20} 
                        color={Colors.primary} 
                        reverse
                        onPress={onReviewSubmit}
                    />
                    <Icon name='add-a-photo' type='material' size={20} color={Colors.momoColor} reverse/>
                </View>
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
    },
    noReviewContainer: {
        marginTop: 25,
    },
    noReviewText: {
        fontSize: hp(2),
        color: Colors.extraText,
        textAlign: 'center'
    },
    chatContainer: {
        borderTopColor: Colors.bgColor,
        borderTopWidth: 1,
        shadowColor: "rgba(0,0,0,0.5)",
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.32,
        elevation: 10,
        zIndex: 10,
        paddingTop: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
    }
});

export default Review;