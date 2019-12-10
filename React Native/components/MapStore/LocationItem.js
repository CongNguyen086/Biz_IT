import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { ListItem } from 'react-native-elements'

class LocationItem extends Component {
    render() {
        const { item: {description, place_id}, onPress, fetchDetails } = this.props
        return (
            <ListItem
                containerStyle={styles.container}
                titleStyle={styles.description}
                title={description}
                onPress={() => onPress(fetchDetails, place_id)}
            />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    description: {
        flex: 0.5,
        justifyContent: 'center',
    },
    address: {
        flex: 0.5,
        justifyContent: 'center',
    },
})

export default LocationItem