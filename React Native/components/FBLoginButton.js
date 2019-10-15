import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

const FBLoginButton = ({loginWithFacebook}) => {
    return (
        <TouchableOpacity style={styles.button}>
            <Icon.Button
                name="facebook"
                backgroundColor="#4e71ba"
                size={30}
                color="white"
                onPress={() => loginWithFacebook()}
            >
                <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>
                    Đăng nhập với Facebook
                </Text>
            </Icon.Button>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
    },
});

export default FBLoginButton;