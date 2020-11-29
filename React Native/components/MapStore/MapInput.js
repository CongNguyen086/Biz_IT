import React, { Component } from 'react'
import { View, StyleSheet, TextInput, TouchableHighlight, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'
import { GoogleAutoComplete } from 'react-native-google-autocomplete'
// Constant
import config from '../../constants/config'
import Colors from '../../constants/Colors'
// Component
import LocationItem from './LocationItem'

class MapInput extends Component {
    constructor(props) {
        super(props)
    }

    renderLocationList = (locationResults, onPress, fetchDetails, hide) => {
        const text = this.text
        if (text !== undefined) {
            if (text._lastNativeText == '' || hide == true) {
                return null
            }

            return (locationResults || []).map(loc => (
                <LocationItem key={loc.description} item={loc} onPress={onPress} fetchDetails={fetchDetails} />
            ))
        }
    }

    renderAddButton = (hideAdd, onPressAdd) => {
        if (hideAdd) {
            return null
        }
        return (
            <TouchableHighlight onPress={() => onPressAdd()}>
                <Ionicons name='md-add-circle-outline' size={27} color={Colors.blueMarker} />
            </TouchableHighlight>
        )
    }

    render() {
        const { currentLat, currentLng, inputText, onPress, hide, 
            info: { title, markColor }, hideAdd, onPressAdd, onRemove } = this.props
        return (
            <GoogleAutoComplete
                apiKey={config.GOOGLE_API_KEY}
                debounce={300}
                language='vi'
                minLength={2}
                radius='70000'
                lat={currentLat}
                lng={currentLng}
            >
                {({
                    handleTextChange,
                    locationResults,
                    fetchDetails,
                    inputValue,
                    clearSearch
                }) => {
                    return (
                            <React.Fragment>
                                <View style={styles.container}>
                                    <View style={styles.titleWrapper}>
                                        <Text style={styles.title}>{title}</Text>
                                    </View>

                                    <View style={styles.inputWrapper}>
                                        <Icon name='map-marker-radius' type='material-community'
                                            size={20} color={markColor} />
                                        <TextInput
                                            ref={(ref) => { this.text = ref }}
                                            style={styles.input}
                                            placeholder='Enter your friend location'
                                            onChangeText={handleTextChange}
                                            value={inputText}
                                        />
                                        {this.renderAddButton(hideAdd, onPressAdd)}
                                        {typeof onRemove === 'function' && (
                                            <TouchableHighlight onPress={onRemove}>
                                                <Ionicons name='md-remove-circle-outline' size={27} color={Colors.defaultMarkerColor} />
                                            </TouchableHighlight>
                                        )}
                                    </View>
                                </View>

                                {/* Render Location List Component */}
                                {this.renderLocationList(locationResults, onPress, fetchDetails, hide)}
                            </React.Fragment>
                        )
                }}
            </GoogleAutoComplete>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        alignItems: 'flex-start',
        // borderWidth: 1,
    },
    titleWrapper: {
        flex: 0.3,
        marginVertical: 10,
        justifyContent: 'center',
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        marginHorizontal: 10,
        flex: 1,
        fontSize: 15,
    },
})

export default MapInput