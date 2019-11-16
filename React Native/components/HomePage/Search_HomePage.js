import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Search_HomePage() {
    return (
        <View style={styles.container}>
            <Ionicons name="ios-search" size={hp(3)} color="white" style={styles.searchIcon}/>
            <TextInput placeholder="Tìm Kiếm" style={styles.searchBar}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchIcon: {
        backgroundColor: 'gray',
        height: hp(3.5),
        opacity: 0.7,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        paddingLeft: wp(2),
        paddingTop: hp(0.3),
        marginLeft: wp(2),
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchBar: {
        width: wp(71),
        height: hp(3.5),
        backgroundColor: 'gray',
        fontWeight: 'bold',
        paddingLeft: wp(2),
        opacity: 0.7,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        color: 'white'
    },
});