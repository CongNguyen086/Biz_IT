import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Rating, ListItem } from 'react-native-elements'

class ReviewElement extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <View style={styles.container}>
                <ListItem
                    leftAvatar={{
                        source: require('../../assets/avatars/avatar.png'),
                    }}
                    title={this.props.name}
                    subtitle={
                        <Rating
                            imageSize={20}
                            style={{ paddingVertical: 10 }}
                        />
                    }
                    style={styles.list}
                />
                <View style={styles.commentContainer}>
                    <Text style={styles.commentLabel}>{this.props.comment}</Text>
                </View>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={this.props.link} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        flex: 0.3
    },
    rate: {
        alignItems: 'flex-start'
    },
    commentContainer: {
        flex: 0.2,
        paddingLeft: 75
    },
    commentLabel: {
        fontSize: 14
    },
    imageContainer: {
        flex: 0.5,
        paddingRight: 75,
        paddingBottom: 10,
        paddingLeft: 75
    },
    image: {
        height: '100%',
        width: '80%',
        borderRadius: 10

    }
});

export default ReviewElement;