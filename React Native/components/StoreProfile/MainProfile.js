import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions, Alert, Image } from 'react-native';
import { Rating, Icon, Button } from 'react-native-elements'
import { withNavigation } from 'react-navigation';
// Contants
import Colors from '../../constants/Colors';

class MainProfile extends Component {
    render() {
        const { name, star, address, distance, storeId } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.photoView}>
                    <Image source={require('../../assets/images/TCH_photo.png')} style={styles.photo} />
                </View>

                <View style={styles.content}>
                    <View style={styles.topView}>
                        <View style={styles.mainInfo}>
                            <Text style={styles.name}>{name}</Text>
                            <View style={styles.rateGroup}>
                                <Rating
                                    // showRating
                                    type="star"
                                    fractions={1}
                                    startingValue={4.5}
                                    readonly
                                    imageSize={15}
                                    onFinishRating={this.ratingCompleted}
                                    style={styles.rate}
                                    ratingColor='#40E247'
                                />
                                <Text style={styles.value}>4.5</Text>
                            </View>
                        </View>
                        <View style={styles.timeView}>
                            <Text style={styles.status}>Đang mở cửa</Text>
                            <Text style={styles.extraValue}>08:00 - 22:00</Text>
                        </View>
                    </View>

                    <View style={styles.middleView}>
                        <View style={styles.distanceView}>
                            <View style={styles.address}>
                                <Icon name='map-marker-radius' type='material-community' size={20} color={Colors.extraText} />
                                <Text style={styles.extraValue, {color: Colors.extraText,marginLeft: 3}}
                                        ellipsizeMode='tail'
                                        numberOfLines={2}>
                                    {address}
                                </Text>
                            </View>
                            <View style={styles.distance}>
                                <Icon name='crosshairs' type='font-awesome' size={22} color={Colors.extraText} />
                                <Text style={styles.extraValue, {color: Colors.extraText,marginLeft: 5}}>{distance}</Text>
                            </View>
                        </View>
                        <View style={styles.distanceIcon}>
                            <Image source={(require('../../assets/icons/map.png'))} 
                                style={styles.icon} />
                        </View>
                    </View>

                    <View style={styles.bottomView}>
                        <Button type='solid' 
                                title='Thanh toán ngay' 
                                buttonStyle={styles.button}
                                titleStyle={{fontSize:18}}
                                onPress={() => this.props.navigation.navigate('Payment', {storeId: storeId})} />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    photoView: {
        flex: 0.45,
    },
    content: {
        flex: 0.55,
        marginHorizontal: 15,
    },
    photo: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
    },
    topView: {
        flex: 0.3,
        flexDirection: 'row',
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: 'red',
    },
    middleView: {
        flex: 0.33,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        borderTopWidth: 1,
        borderColor: '#E8E9E9',
    },
    bottomView: {
        flex: 0.37,
        justifyContent: 'center',
    },
    mainInfo: {
        flex: 0.7,
        justifyContent: 'flex-start',
    },
    name: {
        fontSize: 15,
        textTransform: 'uppercase',
        // backgroundColor: 'red',
    },
    rateGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rate: {
        alignItems: 'flex-start',
    },
    value: {
        color: Colors.extraText,
        fontSize: 15,
        marginLeft: 3,
        marginRight: 8,
    },
    timeView: {
        flex: 0.3,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        // backgroundColor: 'green',
    },
    status: {
        color: '#0DB176',
        fontSize: 15,
    },
    extraValue: {
        color: Colors.extraText,
        fontSize: 15,
    },
    distanceView: {
        flex: 0.9,
        paddingRight: 70,
    },
    distanceIcon: {
        flex: 0.1,
        height: '70%',
        // justifyContent: 'center',
    },
    address: {
        flex: 0.6,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    distance: {
        flex: 0.4,
        flexDirection: 'row',
        // alignItems: 'flex-start',
    },
    icon: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'contain',
    },
    button: {
        backgroundColor: '#EB5757',
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
});

export default withNavigation(MainProfile);