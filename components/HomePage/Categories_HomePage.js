import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, ImageBackground, Image } from 'react-native';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export default function Categories_HomePage() {
    return (
        <Image style={styles.container} source={require('../assets/Categories_HomePage/Body.png')} />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        marginTop: 10,
        width: width,
    },   
});