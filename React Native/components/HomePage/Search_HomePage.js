import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Search_HomePage() {
    return (
        <View style={styles.container}>
            <View style={styles.searchIcon}>
                <Ionicons name="ios-search" size={hp(3)} color="white"/>
            </View>
            <TextInput placeholder="Find places" style={styles.searchBar} placeholderTextColor='#fff'/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchIcon: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        height: hp(4.5),
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        paddingHorizontal: 15,
        paddingTop: hp(0.3),
        marginLeft: wp(2),
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    searchBar: {
        width: wp(65),
        height: hp(4.5),
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        color: 'white'
    },
});