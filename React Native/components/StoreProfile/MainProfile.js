import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, Linking, Alert } from 'react-native';
import { Rating, Icon, Button } from 'react-native-elements'
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
// Contants
import Colors from '../../constants/Colors';

import Configs from '../../constants/config'
import { addNewAppointment } from '../../services/app/actions';
import { MAX_PENDING_APPOINTMENTS } from '../../services/app/constants';
import { getPendingAppointments } from '../../services/app/getters';

class MainProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reviewImage: null,
        }
    }

    openMap(address, latitude, longitude) {
        const url = Platform.select({
            ios: "maps:" + latitude + "," + longitude + "?q=" + address,
            android: "geo:" + latitude + "," + longitude + "?q=" + address
        });
        Linking.openURL(url);
    }

    componentDidMount() {
        this.getMerchantImage(this.props.serviceId)
    }

    getMerchantImage = async (serviceId) => {
        try {
            const response = await fetch(Configs.ROOT + `/getmerchantimage?serviceId=${serviceId}`);
            const jsonData = await response.json();
            this.setState({ reviewImage: jsonData[0].reviewImage })
        } catch (error) {
            console.log(error)
        }
    }

    addToPendingAppointment = () => {
        const {dispatch, store, pendingAppointments} = this.props;
        if (pendingAppointments.length < MAX_PENDING_APPOINTMENTS) {
            if (!pendingAppointments.find(s => s.storeId === store.storeId)) {
                dispatch(addNewAppointment({store}))
                Alert.alert('Add store successfully!');
            } else {
                Alert.alert('This store has been added to pending appointments list');
            }
        } else {
            Alert.alert('Maximum 3 stores in pending appointments');
        }
    }

    render() {
        const { 
            storeName, 
            storeRating, 
            storeAddress, 
            distance, 
            storeId, 
            latitude, 
            longitude
        } = this.props.store;
        const {pendingAppointments} = this.props;
        const {reviewImage} = this.state;

        const source = reviewImage ? {uri: reviewImage} : require('../../assets/images/TCH_photo.png')
        const isDisableButton = !!pendingAppointments.find(s => s.storeId === storeId);

        return (
            <View style={styles.container}>
                <View style={styles.photoView}>
                <Image 
                    source={source}
                    style={styles.photo} 
                />
                </View>

                <View style={styles.content}>
                    <View style={styles.topView}>
                        <View style={styles.mainInfo}>
                            <Text style={styles.name}>{storeName}</Text>
                            <View style={styles.rateGroup}>
                                <Rating
                                    // showRating
                                    type="star"
                                    fractions={1}
                                    startingValue={storeRating}
                                    readonly
                                    imageSize={15}
                                    onFinishRating={this.ratingCompleted}
                                    style={styles.rate}
                                    ratingColor='#40E247'
                                />
                                <Text style={styles.value}>{storeRating}</Text>
                            </View>
                        </View>
                        <View style={styles.timeView}>
                            <Text style={styles.status}>Opening</Text>
                            <Text style={styles.extraValue}>08:00 - 22:00</Text>
                        </View>
                    </View>

                    <View style={styles.middleView}>
                        <View style={styles.distanceView}>
                            <View style={styles.address}>
                                <Icon name='map-marker-radius' type='material-community' size={20} color={Colors.extraText} />
                                <Text style={styles.extraValue, { color: Colors.extraText, marginLeft: 3 }}
                                    ellipsizeMode='tail'
                                    numberOfLines={2}>
                                    {storeAddress}
                                </Text>
                            </View>
                            <View style={styles.distance}>
                                <Icon name='crosshairs' type='font-awesome' size={22} color={Colors.extraText} />
                                <Text style={styles.extraValue, { color: Colors.extraText, marginLeft: 5 }}>{`${distance + ' m from your current location'}`}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.distanceIcon} onPress={() => this.openMap(storeAddress, latitude, longitude)}>
                            <Image source={(require('../../assets/icons/map.png'))}
                                style={styles.icon} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bottomView}>
                        <Button type='solid'
                            title='Add to appointment list'
                            buttonStyle={styles.button}
                            titleStyle={{ fontSize: 18 }}
                            disabled={isDisableButton}
                            onPress={this.addToPendingAppointment} />
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
        backgroundColor: Colors.primary,
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

const mapStateToProps = state => ({
    pendingAppointments: getPendingAppointments(state)
})

export default connect(mapStateToProps, null)(withNavigation(MainProfile));