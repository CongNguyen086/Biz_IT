import React, { Component } from 'react';
import {
    AsyncStorage,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import Colors from '../constants/Colors'

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

class Loading extends Component {
    componentDidMount = async () => {
        const token = await AsyncStorage.getItem('@userToken');
        // console.log('Token:',token)
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
                    animating={true}
                    size="large" 
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    activityIndicatorWrapper: {
        flex: 1,
        backgroundColor: Colors.momoColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
})

export default Loading;