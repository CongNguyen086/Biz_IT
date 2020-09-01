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
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="purple" />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>{this.props.title}</Text>
                </View>
                <FlatList
                    data={products}
                    renderItem={({ item }) =>
                        <ProductElement
                            style={styles.products}
                            item={item}
                            navigation={this.props.navigation} />
                    }
                    keyExtractor={item => item.topServiceId}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 100,
        padding: 15,
        alignItems: 'flex-start',
    },
    labelContainer: {
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    label: {
        textAlign: 'left',
        fontWeight: '600',
    },
    products: {
        flex: 0.8,
        borderRadius: 12,
    },
});