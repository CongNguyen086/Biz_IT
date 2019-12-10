import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

//Component
import ProductElement from './ProductElement';



export default class ProductsContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            loading: false
        }
    }
    componentDidMount() {
        this.setState({ loading: true})
    }
    componentWillReceiveProps() {
        this.setState({ data: this.props.data })
        if(this.state.data != null) {
            this.setState({loading: false})
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="purple" animating={this.state.loading} />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>{this.props.title}</Text>
                </View>
                <FlatList
                    data={this.state.data}
                    renderItem={({ item }) =>
                        <ProductElement
                            style={styles.products}
                            item={item}
                            navigation={this.props.navigation} />
                    }
                    keyExtractor={item => item.topServiceId}
                    horizontal={true}
                    refreshing={this.state.refreshing}
                />
            </View>
        );
    }
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