import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button } from 'react-native-elements';
// Constants
import Colors from '../constants/Colors'

class LongButton extends Component {
    render() {
        const { onPress } = this.props
        return (
            <View style={styles.buttonContainer}>
                <Button type='solid'
                    title='Tìm điểm hẹn'
                    buttonStyle={styles.button}
                    titleStyle={{ fontSize: 18 }}
                    onPress={() => onPress()} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        justifyContent: 'center',
        marginVertical: 10,
    },
    button: {
        backgroundColor: Colors.button,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
    },
})

export default LongButton