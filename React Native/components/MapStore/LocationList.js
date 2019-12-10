import React, { Component } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import LocationItem from './LocationItem'

class LocationList extends Component {
    constructor(props) {
        super(props);
    }

    renderList = ({ item }) => {
        const { onPress, fetchDetails } = this.props
            return (<LocationItem
                item={item}
                // address={item.address}
                onPress={onPress}
                fetchDetails={fetchDetails}
            />)
    };

    renderKeyExtractor = (item, index) => index.toString();

    renderSeparator = () => {
        return (
            <View style={styles.separator} />
        );
    };

    render() {
        const { data } = this.props
        return (
            <View styles={styles.container}>
                <FlatList
                    data={data}
                    renderItem={this.renderList}
                    keyExtractor={this.renderKeyExtractor}
                    ItemSeparatorComponent={this.renderSeparator}
                    keyboardShouldPersistTaps='handled'
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    separator: {
        height: 1,
        backgroundColor: "#E8E9E9",
    },
})

export default LocationList
