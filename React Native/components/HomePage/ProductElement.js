import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import {withNavigation} from 'react-navigation'
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

function ElementProducts({navigation, item, style}) {
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
        <TouchableOpacity onPress={() => navigation.navigate('DealDetails', {info: item})} style={styles.container}>
            <Image
                style={styles.imageContainer}
                source={{uri: item.image}}
            />
            <View style={styles.labelContainer}>
                <Text style={{ fontSize: 16, flex: 0.9 }}>{item.description}</Text>
                <View style={styles.iconContainer}>
                    <Ionicons
                        style={styles.heartIcon}
                        name={heart} size={hp(3.4)}
                        color={heartColor}
                        onPress={() => Like()}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default withNavigation(ElementProducts)

const styles = StyleSheet.create({
    container: {
        width: '100%',
        minHeight: 100,
    },
    imageContainer: {
        flex: 0.75,
        height: '100%',
        width: '100%',
        minHeight: 200,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
    },
    labelContainer: {
        flex: 0.25,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        marginVertical: 10,
        paddingBottom: 3
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