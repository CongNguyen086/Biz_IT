import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import { Rating, ListItem } from 'react-native-elements'

class ReviewElement extends PureComponent {
    constructor(props) {
        super(props)
    }
    render() {
        const { review } = this.props
        return (
            <ListItem
                leftAvatar={{
                    source: {
                        uri: review.avatar
                    }
                }}
                containerStyle={styles.container}
                bottomDivider
                title={review.fullName}
                subtitle={
                    <React.Fragment>
                        <Rating
                            imageSize={20}
                            style={[styles.rate, styles.section]}
                            readonly
                            startingValue={review.star}
                        />
                        <Text style={[styles.commentLabel, styles.section]}>{review.comment}</Text>
                        <FlatList
                            style={styles.section}
                            data={review.pictures}
                            renderItem={({ item }) => <Image style={styles.image} source={{ uri: item }} />}
                            keyExtractor={item => item}
                            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            alwaysBounceHorizontal={false}
                        />
                    </React.Fragment>
                }
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
    },
    rate: {
        alignItems: 'flex-start'
    },
    section: {
        marginTop: 10,
    },
    commentLabel: {
        fontSize: 16,
    },
    imageContainer: {
        paddingBottom: 10,
    },
    image: {
        height: 100,
        width: 100,
        borderRadius: 10,
    },
    itemSeparator: {
        width: 15,
    }
});

export default ReviewElement;