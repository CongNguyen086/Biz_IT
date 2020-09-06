import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
        borderRadius: 10,
        margin: -1,
        elevation: 3,
    },
    image: {
        height: hp(20),
    },
});

export default CardCustom;