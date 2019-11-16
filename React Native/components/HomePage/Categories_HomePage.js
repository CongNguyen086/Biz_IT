import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Categories_HomePage() {
    return (
        <Image style={styles.container} source={require('../../assets/Categories_HomePage/Body.png')} />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        margin: hp(1)
        // resizeMode: 'contain',
    },   
});