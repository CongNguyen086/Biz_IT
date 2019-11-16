import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

//Component
import ProductElement from './ProductElement';

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
        borderRadius: 10,
        width: wp(100),
        justifyContent: 'center',
        paddingBottom: hp(2),

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    labelContainer: {
        flex: 0.2,
        justifyContent: 'center'
    },
    label: {
        fontWeight: 'bold',
        fontSize: hp(2.2),
        marginLeft: 20
    },
    products: {
        flex: 0.8,
        borderRadius: 12,
    },
});