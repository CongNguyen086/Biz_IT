import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Dimensions,
    Alert,
    Image,
    TouchableHighlight,
    Share
} from 'react-native';
import MainProfile from '../components/StoreProfile/MainProfile';
import Review from '../components/StoreProfile/Review'
import { Ionicons } from '@expo/vector-icons'
import HeaderTitle from '../components/HeaderTitle';
import Colors from '../constants/Colors';

const ShareButton = ({ onPress }) => {
    return (
        <TouchableHighlight onPress={() => onPress()}>
            <Ionicons name='md-share' size={28} color='white' />
        </TouchableHighlight>
    )
}

class StoreProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    static navigationOptions = ({ navigation }) => {
        const shareAddress = async () => {
            const info = navigation.getParam('info', 'No info');
            try {
                const result = await Share.share({
                    message: info.storeAddress,
                });
    
                if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                        // shared with activity type of result.activityType
                    } else {
                        // shared
                    }
                } else if (result.action === Share.dismissedAction) {
                    // dismissed
                }
            } catch (error) {
                alert(error.message);
            }
        }
        return {
            headerTitle: <HeaderTitle title={navigation.getParam('categoryName', 'No categoryName')} />,
            headerRight: <ShareButton onPress={shareAddress} />
        };
    };

    render() {
        const info = this.props.navigation.getParam('info', 'No info');
        const distance = info.distance + ' m từ vị trí hiện tại'
        return (
            <View style={styles.container}>
                <View style={styles.storeProfile}>
                    <MainProfile
                        name={info.storeName}
                        star={info.storeRating}
                        address={info.storeAddress}
                        storeId={info.storeId}
                        distance={distance}
                    />
                </View>
                <View style={styles.review}>
                    <Review
                        storeId={info.storeId}
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
    storeProfile: {
        flex: 0.55,
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
        flex: 0.45,
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