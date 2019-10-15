import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, FlatList } from 'react-native';

//Component
import ProductElement from './ProductElement';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;


export default function ProductsContainer(props) {
    return (
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>{props.title}</Text>
            </View>
            <FlatList
                data={props.data}
                renderItem={({ item }) => 
                <ProductElement 
                    style={styles.products} 
                    item={item}
                    navigation={props.navigation} />
                }
                keyExtractor={item => item.topServiceId}
                horizontal={true} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 12,
        marginTop: 10,
        width: width,
        justifyContent: 'center',
        paddingBottom: 15
    },
    labelContainer: {
        flex: 0.2,
        justifyContent: 'center'
    },
    label: {
        fontWeight: 'bold',
        fontSize: 17,
        marginLeft: 20
    },
    products: {
        flex: 0.8,
        borderRadius: 12,
    },
});