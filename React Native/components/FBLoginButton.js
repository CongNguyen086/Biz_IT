import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

const FBLoginButton = ({loginWithFacebook, containerStyle = {}}) => {
    return (
        <TouchableOpacity style={[styles.button, containerStyle]} onPress={() => loginWithFacebook()}>
            <Icon
                name="facebook"
                size={25}
                color="white"
                style={{marginRight: 15}}
            >
            </Icon>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>
                Login with Facebook
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 50,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "rgba(0,0,0,0.4)",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
        backgroundColor: '#4e71ba'
    },
});

export default FBLoginButton;