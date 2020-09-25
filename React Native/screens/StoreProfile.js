import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    Share
} from 'react-native';
import MainProfile from '../components/StoreProfile/MainProfile';
import Review from '../components/StoreProfile/Review'
import { Ionicons } from '@expo/vector-icons'
import HeaderTitle from '../components/HeaderTitle';
import Colors from '../constants/Colors';
import { connect } from 'react-redux';
import { getPendingAppointments } from '../services/app/getters';

const ShareButton = ({ onPress }) => {
    return (
        <TouchableHighlight onPress={() => onPress()}>
            <Ionicons name='md-share' size={28} color='white' />
        </TouchableHighlight>
    )
}

class StoreProfile extends Component {
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
            headerTitle: <HeaderTitle title='Store profile' />,
            headerRight: <ShareButton onPress={shareAddress} />
        };
    };

    render() {
        const store = this.props.navigation.getParam('store', {});
        return (
            <View style={styles.container}>
                <View style={styles.storeProfile}>
                    <MainProfile
                        store={store}
                    />
                </View>
                <View style={styles.review}>
                    <Review
                        storeId={store.storeId}
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

        shadowColor: "rgba(0,0,0,0.4)",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.32,
        zIndex: 3,
        elevation: 3,
    },
    review: {
        flex: 0.45,
        backgroundColor: 'white',
        marginTop: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,

        shadowColor: "rgba(0,0,0,0.4)",
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.32,
        elevation: 3,
        zIndex: 3,
    },
});

const mapStateToProps = state => ({
    pendingAppointments: getPendingAppointments(state)
})

export default StoreProfile;