import React, { Component } from 'react';
import {
    AsyncStorage,
    StyleSheet,
    Text,
    View,
    ActivityIndicator
} from 'react-native';
import Colors from '../constants/Colors'

class Loading extends Component {
    componentDidMount = async () => {
        const token = await AsyncStorage.getItem('@userToken');
        console.log(token)
        if(token !== null) {
            this.props.navigation.navigate('App');
        } else {
            this.props.navigation.navigate('Login');
        }
    }

    render() {
        return (
            <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator
                    animating={true} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    activityIndicatorWrapper: {
        backgroundColor: Colors.momoColor,
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
})

export default Loading;