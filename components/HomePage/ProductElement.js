import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export default function ElementProducts(props) {
    const [heart, setHeart] = useState('ios-heart-empty')
    const [heartColor, setHeartColor] = useState('black')
    const Like = () => {
        if (heart === 'ios-heart-empty') {
            setHeart('ios-heart')
            setHeartColor('#EB4956')
        }
        else {
            setHeart('ios-heart-empty')
            setHeartColor('black')
        }
    }
    return (
        <View style={styles.container}>
            <Image
                style={styles.imageContainer}
                source={props.source}
            />
            <View style={styles.labelContainer}>
                <Text style={{ fontSize: 17, flex: 0.9, paddingLeft: 8 }}>{props.content}</Text>
                <View style={styles.iconContainer}>
                    <Ionicons
                        style={styles.heartIcon}
                        name={heart} size={28}
                        color={heartColor}
                        onPress={() => Like()}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: 300,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 12,
        //shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        marginBottom: 10
    },
    imageContainer: {
        flex: 0.75,
        height: '100%',
        width: '100%',
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12
    },
    labelContainer: {
        flex: 0.25,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    iconContainer: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    heartIcon: {
        borderLeftWidth: 1,
        paddingLeft: 8,
        borderLeftColor: '#E5E5E5'
    }
});