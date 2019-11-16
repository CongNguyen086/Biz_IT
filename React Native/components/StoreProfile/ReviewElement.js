import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import { Rating, ListItem } from 'react-native-elements'
import ROOT from '../../constants/Root'

class ReviewElement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataImage: null
        }
    }
    componentDidMount () {
        this.getImageData(this.props.reviewId)
    }
    getReviewData = async (storeId) => {
        const response = await fetch(ROOT + `/getreview?storeId=${storeId}`);
        const jsonData = await response.json();
        this.setState({ reviewData: jsonData })
    }
    getImageData = async (reviewId) => {
        const response = await fetch(ROOT + `/getimage?reviewId=${reviewId}`);
        const jsonData = await response.json();
        this.setState({ dataImage: jsonData })
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
                            style={styles.rate}
                            readonly
                            startingValue={this.props.star}
                        />
                    }
                    style={styles.list}
                />
                <View style={styles.commentContainer}>
                    <Text style={styles.commentLabel}>{this.props.comment}</Text>
                </View>
                <View style={styles.imageContainer}>
                    <FlatList
                        data={this.state.dataImage}
                        renderItem={({ item }) => <Image style={styles.image} source={{ uri: ROOT + '/' + item.reviewPhoto.substring(8) }} />}
                        keyExtractor={item => item.reviewPhoto}
                        horizontal={true}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderBottomWidth: 0.5,
        borderBottomColor: '#979aa2'
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
        paddingLeft: 75,
    },
    image: {
        flex: 0.2,
        height: 100,
        width: 100,
        borderRadius: 10,
        marginTop: 10,
        marginRight: 10
    }
});

export default ReviewElement;