import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Search_HomePage() {
    return (
        <View style={styles.container}>
            <Ionicons name="ios-search" size={24} color="white" style={styles.searchIcon}/>
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
        height: 28,
        opacity: 0.7,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        paddingLeft: 10,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchBar: {
        width: 200,
        height: 28,
        backgroundColor: 'gray',
        fontWeight: 'bold',
        paddingLeft: 10,
        opacity: 0.7,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        color: 'white'
    },
});