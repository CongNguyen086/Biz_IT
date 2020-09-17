import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

//Component
import ProductElement from './ProductElement';

export default class ProductsContainer extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {loading, products} = this.props;
        if (loading) {
            return (
                <View style={[styles.container, styles.productsLoading]}>
                    <ActivityIndicator size="large" color="purple" />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>{this.props.title}</Text>
                </View>
                {products && products.map(item => (
                    <ProductElement
                        key={item.dealId}
                        item={item}
                    />
                ))}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // minHeight: 100,
        padding: 15,
        alignItems: 'flex-start',
    },
    labelContainer: {
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    label: {
        textAlign: 'left',
        fontSize: 16,
        fontWeight: '600',
    },
    productsLoading: {
        justifyContent: 'center',
        alignItems: 'center'
    },
});