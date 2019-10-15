import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions, Alert, Image } from 'react-native';
import { Card } from 'react-native-elements';

class CardCustom extends Component {
    render() {
        const { image, children } = this.props;
        return(
            <Card
                containerStyle={styles.container}
                image={image}
                imageStyle={styles.image}
                imageProps={{ resizeMode: 'cover' }}
            >
                {children}
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 10,
        margin: -1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
    },
    image: {
        height: 150,
    },
});

export default CardCustom;