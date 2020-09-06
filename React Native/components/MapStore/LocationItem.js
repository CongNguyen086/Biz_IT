import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { ListItem } from 'react-native-elements'

class LocationItem extends Component {
    render() {
        const { item: {description, place_id}, onPress, fetchDetails } = this.props
        return (
            <ListItem
                titleStyle={styles.description}
                title={description}
                onPress={() => onPress(fetchDetails, place_id)}
            />
        )
    }
}

const styles = StyleSheet.create({
    description: {
        flex: 0.5,
        justifyContent: 'center',
    },
})

export default LocationItem