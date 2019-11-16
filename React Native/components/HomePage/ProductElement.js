import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function ElementProducts(props) {
    const { item } = props;
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
        <TouchableHighlight onPress={() => props.navigation.navigate('DealDetails', {info: item})}>
            <View style={styles.container}>
                <Image
                    style={styles.imageContainer}
                    source={{uri: item.image}}
                />
                <View style={styles.labelContainer}>
                    <Text style={{ fontSize: hp(2.1), flex: 0.9, paddingLeft: wp(2) }}>{item.description}</Text>
                    <View style={styles.iconContainer}>
                        <Ionicons
                            style={styles.heartIcon}
                            name={heart} size={hp(3.4)}
                            color={heartColor}
                            onPress={() => Like()}
                        />
                    </View>
                </View>
            </View> 
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: wp(70),
        marginLeft: wp(2),
        marginRight: wp(2),
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
        marginBottom: hp(1)
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