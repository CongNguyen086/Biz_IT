import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import Colors from '../../constants/Colors';

export class StoreInfo extends Component {
    constructor(props) {
        super(props)
        this.openTime = 8
        this.closeTime = 22
    }
    render() {
        const { data: { storeName, description, distance, storeRating } } = this.props;
        const currentHour = new Date().getHours()
        const isOpen = currentHour >= this.openTime && currentHour < this.closeTime

        return (
            <View style={styles.container}>
                <View style={styles.mainInfo}>
                    <View style={styles.storeInfo}>
                        <Text style={styles.name} numberOfLines={1} ellipsizeMode='tail'>{storeName}</Text>
                        <View style={styles.details}>
                            <FontAwesome name='star' size={15} color='#FFC601' />
                            <Text style={styles.extraText}>{storeRating}</Text>
                            <FontAwesome name='circle' size={15} color={isOpen ? '#40E247' : '#bdc3c7'} />
                            <Text style={styles.extraText}>{`${this.openTime}:00 - ${this.closeTime}:00`}</Text>
                            <Text style={styles.extraText}>{this.props.categoryName}</Text>
                        </View>
                    </View>
                    <View style={styles.promotionView}>
                        <Text>{description}</Text>
                    </View>
                </View>

                <View style={styles.distanceView}>
                    <Text style={styles.distance}>{Number(distance / 1000).toFixed(1)} km</Text>
                </View>
            </View>
        );
    }
}

export class Avatar extends Component {
    render() {
        const { data: { icon } } = this.props;
        return (
            <View style={styles.imageContainer}>
                <Image source={{ uri: icon }} style={styles.image} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0.71,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    mainInfo: {
        flex: 0.8,
    },
    distanceView: {
        flex: 0.2,
    },
    storeInfo: {
        flex: 0.5,
    },
    promotionView: {
        flex: 0.5,
        justifyContent: 'center',
    },
    name: {
        fontSize: 13,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        lineHeight: 25,
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    extraText: {
        color: Colors.extraText,
        fontSize: 12,
        marginLeft: 3,
        marginRight: 8,
    },
    distance: {
        color: Colors.extraText,
        fontSize: 13,
        textAlign: 'right',
        lineHeight: 25,
    },
    imageContainer: {
        flex: 0.28,
    },
    image: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'contain',
    },
});