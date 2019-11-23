import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import ROOT from '../../constants/Root'

import Colors from '../../constants/Colors';

export class StoreInfo extends Component {
    constructor(props) {
        super(props)
        this.state = { }
    }
    render() {
        const { data: { storeName, description, distance, storeRating } } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.mainInfo}>
                    <View style={styles.storeInfo}>
                        <Text style={styles.name} numberOfLines={1} ellipsizeMode='tail'>{storeName}</Text>
                        <View style={styles.details}>
                            <FontAwesome name='star' size={15} color='#FFC601' />
                            <Text style={styles.extraText}>{storeRating}</Text>
                            <FontAwesome name='circle' size={15} color='#40E247' />
                            <Text style={styles.extraText}>8:00 - 22:00</Text>
                            <Text style={styles.extraText}>{this.props.categoryName}</Text>
                        </View>
                    </View>
                    <View style={styles.promotionView}>
                        <Text>{description}</Text>
                    </View>
                </View>

                <View style={styles.distanceView}>
                    <Text style={styles.distance}>{distance}m</Text>
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
        flex: 0.7,
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