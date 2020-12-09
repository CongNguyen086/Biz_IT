import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableHighlight,
    Share, 
    Keyboard,
    Text,
    LayoutAnimation, 
    KeyboardAvoidingView, 
    Platform
} from 'react-native';
import MainProfile from '../components/StoreProfile/MainProfile';
import Review from '../components/StoreProfile/Review'
import { Ionicons } from '@expo/vector-icons'
import HeaderTitle from '../components/HeaderTitle';
import Colors from '../constants/Colors';
// import { SafeAreaView } from 'react-navigation';
import { getPendingAppointments } from '../services/app/getters';
import {SafeAreaConsumer} from 'react-native-safe-area-context'

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
        this.state = {
            keyboardFocus: false,
        }
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
            headerTitle: <HeaderTitle title='Store profile' />,
            headerRight: <ShareButton onPress={shareAddress} />
        };
    };

    componentDidMount() {
        Keyboard.addListener('keyboardWillShow', this.keyboardShow)
        Keyboard.addListener('keyboardWillHide', this.keyboardHide)
    }

    componentWillUnmount() {
        Keyboard.removeListener('keyboardWillShow', this.keyboardShow)
        Keyboard.removeListener('keyboardWillHide', this.keyboardHide)
    }

    keyboardShow = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
        this.setState({
            keyboardFocus: true
        })
    }
    keyboardHide = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
        this.setState({
            keyboardFocus: false
        })
    }

    render() {
        const store = this.props.navigation.getParam('store', {});
        console.log("🚀 ~ file: StoreProfile.js ~ line 89 ~ StoreProfile ~ render ~ store", store)
        const {keyboardFocus} = this.state;
        return (
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding': 'height'} style={styles.container}>
                <SafeAreaConsumer>
                    {insets => (
                        <View 
                            style={{
                                flex: 1, 
                                paddingBottom: insets.bottom,
                                paddingLeft: insets.left,
                                paddingRight: insets.right,
                            }}
                        >
                            {!keyboardFocus && (
                                <View style={styles.storeProfile}>
                                    <MainProfile
                                        store={store}
                                    />
                                </View>
                            )}
                            <View style={[styles.review, keyboardFocus && styles.noProfile]}>
                                <Review
                                    storeId={store.storeId}
                                />
                            </View>
                        </View>
                    )}
                </SafeAreaConsumer>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
            height: -4,
        },
        shadowOpacity: 0.32,
        elevation: 3,
        zIndex: 3,
    },
    noProfile: {
        flex: 1,
        marginTop: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        paddingBottom: 65,
    }
});

const mapStateToProps = state => ({
    pendingAppointments: getPendingAppointments(state)
})

export default StoreProfile;