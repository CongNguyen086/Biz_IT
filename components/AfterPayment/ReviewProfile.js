import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { Rating, Button } from 'react-native-elements'

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout'

const width = Layout.width;
const height = Layout.height;

class ReviewProfile extends Component {
    render() {
        const { name, star, address, distance } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerLabel}>Trải nghiệm tại quán của bạn {'\n'} như thế nào</Text>
                </View>
                <View style={styles.rateGroup}>
                    <Rating
                        // showRating
                        type="star"
                        fractions={1}
                        startingValue={5}
                        readonly
                        imageSize={30}
                        onFinishRating={this.ratingCompleted}
                        style={styles.rate}
                        ratingColor='#40E247'
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputStyle}
                        multiline
                        editable
                        numberOfLines={5}
                        maxLength={500}
                        placeholder='Hãy nói lên những suy nghĩ của bạn về chúng tôi'
                    />
                </View>
                <View style={styles.footerContainer}>
                    <View style={styles.importImage}>
                        <Text style={{ color: '#AE2070' }} >+Thêm{'\n'}Hình Ảnh</Text>
                    </View>
                    <View style={styles.buttonSendContainer}>
                        <Button title='Gửi' titleStyle={{ fontSize: 18 }} buttonStyle={styles.buttonSend} />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
    },
    headerContainer: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    rateGroup: {
        flex: 0.1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    rate: {
        alignItems: 'flex-start',
    },
    inputContainer: {
        flex: 0.42,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputStyle: {
        height: '95%',
        width: '95%',
        backgroundColor: '#F5F5F5',
        borderRadius: 5,
        textAlignVertical: 'top',
        padding: 10

    },
    footerContainer: {
        flex: 0.28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    importImage: {
        flex: 0.2,
        width: '80%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderRadius: 5,
        borderColor: '#AE2070',
        borderWidth: 2,
        borderStyle: 'dotted'
    },
    buttonSendContainer: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonSend: {
        backgroundColor: '#AE2070',
        paddingLeft: 30,
        paddingRight: 30
    }
});

export default ReviewProfile;