import React, { Component } from 'react'
import { 
    StyleSheet, 
    Dimensions, 
    Platform, 
    View, 
    Text, 
    Keyboard, 
    KeyboardAvoidingView, 
    ScrollView, 
    LayoutAnimation, 
    UIManager, 
    TouchableOpacity
} from 'react-native'
import {SafeAreaConsumer} from 'react-native-safe-area-context'
import MapView, { Marker, Circle, Callout } from 'react-native-maps'
import { Divider, Icon, Button } from 'react-native-elements'
import { getDistance } from 'geolib'
// import { Svg, Circle } from 'react-native-svg'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
// Constants
import config from '../constants/config'
import Colors from '../constants/Colors'
// Components
import MapInput from '../components/MapStore/MapInput'
import MapStoreList from '../components/MapStore/MapStoreModal'
import FilterModal from '../components/MapStore/FilterModal'
import * as Animatable from 'react-native-animatable'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

class MapStore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRegion: {},
            currentLocation: {},
            middleCoords: {},
            storeList: [],
            locationList: [],
            statusBarHeight: 0,
            hideList: true,
            isStoreVisible: false,
            isFilterVisible: false,
            categoryList: [],
            keyboardHeight: 0,
            collapsed: false,
        }
        radius = this.props;
    }

    _handleKeyboardShow = (event) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
        this.setState({
            keyboardHeight: event.endCoordinates.height
        })
    }

    _handleKeyboardHide = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
        this.setState({
            keyboardHeight: 0,
        })
    }

    componentDidMount = async () => {
        radius = 1000
        await this.getPosition()
        this.addNewInput()
        // await this.getStoresInRange()
        setTimeout(() => this.setState({ statusBarHeight: 10 }), 5000)
        Keyboard.addListener('keyboardDidShow', this._handleKeyboardShow)
        Keyboard.addListener('keyboardDidHide', this._handleKeyboardHide)
    }

    componentWillUnmount() {
        Keyboard.removeListener('keyboardDidShow', this._handleKeyboardShow)
        Keyboard.removeListener('keyboardDidHide', this._handleKeyboardHide)
    }

    getPosition = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied')
        }

        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
        let newList = this.state.locationList
        newList.push({
            description: 'Current location',
            coords: {
                lat: location.coords.latitude,
                lng: location.coords.longitude
            }
        })

        this.setState({
            currentRegion: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            currentLocation: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            },
            locationList: newList,
            // latitude: location.coords.latitude,
            // longitude: location.coords.longitude,
        });
    };

    getMiddlePoint = async () => {
        const { locationList } = this.state
        const payload = []
        locationList.forEach((loc) => {
            if (!loc || !loc.coords || !loc.description) return
            payload.push({
                latitude: loc.coords.lat,
                longitude: loc.coords.lng
            })
        })
        const respond = await fetch(config.ROOT + `/getMiddlePoint`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                locationList: payload
            })
        })
        const middlePoint = await respond.json()
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
        this.setState({
            middleCoords: {
                latitude: middlePoint.latitude,
                longitude: middlePoint.longitude,
            },
            currentRegion: {
                latitude: middlePoint.latitude,
                longitude: middlePoint.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            collapsed: true,
        }, () => console.log('Middle Point:', this.state.middleCoords))
        await this.getStoresInRange()
    }

    renderCircle = () => {
        const { middleCoords } = this.state
        if (middleCoords.latitude == null) {
            return null
        }
        return (
            <Circle
                center={middleCoords}
                radius={radius}
                strokeWidth={2}
                fillColor='rgba(205,214,208,0.7)'
            />
        )
    }

    getStoresInRange = async () => {
        const { latitude, longitude } = this.state.middleCoords
        const respond = await fetch(config.ROOT + `/getStoresInRange/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                middleLat: latitude,
                middleLng: longitude,
                radius: radius
            })
        })
        const storeList = await respond.json()
        this.setState({ storeList: storeList, isStoreVisible: !this.state.isStoreVisible },
            () => this.addDistanceToStore(this.state.storeList)    
        )
    }

    addDistanceToStore = (storeList) => {
        const { currentLocation } = this.state
        storeList.forEach((el) => {
            const distance = getDistance(
                {
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude
                },
                {
                    latitude: el.latitude,
                    longitude: el.longitude
                }
            )
            el.distance = distance
        })
    }

    getCoordsFromName = async (fetchDetails, place_id, locationIndex = 0) => {
        if (locationIndex === 0) {
            return
        }
        const res = await fetchDetails(place_id)
        const resLocation = res.geometry.location
        const currentRegion = {
            latitude: resLocation.lat,
            longitude: resLocation.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }
        Keyboard.dismiss()
        const {locationList} = this.state
        if (locationList.length > 1 && locationIndex < locationList.length) {
            const newLocationList = [...locationList]
            newLocationList[locationIndex] = {
                ...newLocationList[locationIndex],
                coords: resLocation,
                description: res.formatted_address
            }
            this.setState({
                locationList: newLocationList,
                currentRegion,
            })
        }
    }

    onRegionChange = (currentRegion) => {
        this.setState({ currentRegion })
    }

    renderMarker = () => {
        const { locationList } = this.state
        return (
            locationList.map((loc, index) => {
                if (!loc.description || !loc.coords) {
                    return null
                }
                let color = Colors.blueMarker
                let title = 'My Location'
                if (index > 0) {
                    color = Colors.defaultMarkerColor   
                    title = `Location of friend ${index}`
                }
                
                return (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: loc.coords.lat,
                            longitude: loc.coords.lng
                        }}
                        title={title}
                        pinColor={color}
                    />
                )
            })
        )
    }

    addNewInput = () => {
        this.setState(prevState => ({
            locationList: [...prevState.locationList, {coords: null, description: null}]
        }))
    }
    onRemoveLocation = (locationIndex) => {
        const {locationList} = this.state;
        const newLocationList = [...locationList]
        newLocationList.splice(locationIndex, 1)
        this.setState({
            locationList: newLocationList
        })
    }

    renderOtherMapInput = () => {
        const { currentRegion, locationList } = this.state
        const {onRemoveLocation} = this
        return (
            locationList.map((loc, index) => {
                if (index === 0) return null
                return (
                    <React.Fragment key={index}>
                        <Divider style={styles.separator} />
                        <MapInput
                            currentLat={currentRegion.latitude}
                            currentLng={currentRegion.longitude}
                            inputText={loc.description}
                            onPress={(fetchDetails, place_id) => this.getCoordsFromName(fetchDetails, place_id, index)}
                            hide={!!loc.description}
                            info={{ title: `Friend ${index}`, markColor: Colors.defaultMarkerColor }}
                            hideAdd={!loc.description || index !== locationList.length - 1}
                            onPressAdd={this.addNewInput}
                            onRemove={loc.description && index < locationList.length - 1 ? () => onRemoveLocation(index) : null}
                        />
                    </React.Fragment> 
                )
            })
        )
    }

    renderStoreModal = () => {
        const { storeList } = this.state
        if (storeList.length == 0) {
            return null
        }
        return (
            <MapStoreList data={storeList} onPress={this.renderFilter} />
        )
    }

    renderFilter = async () => {
        const res = await fetch(config.ROOT + '/getAllCategories')
        const cateList = await res.json()
        if (cateList != null) {
            this.setState({
                categoryList: cateList,
                isFilterVisible: !this.state.isFilterVisible,
            })
        }
    }

    filter = (id) => {
        const { storeList, isFilterVisible } = this.state
        const newStoreList = storeList.filter((item) => (
            item.categoryId == id
        ))
        this.setState({
            storeList: newStoreList,
            isFilterVisible: !isFilterVisible,
        })
    }

    dismissModal = () => {
        this.setState({ isFilterVisible: !this.state.isFilterVisible })
    }

    toggleCallout = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
        this.setState(prevState => ({
            collapsed: !prevState.collapsed
        }))
    }

    render() {
        const { currentRegion, storeList, locationList, isFilterVisible, categoryList, keyboardHeight, collapsed } = this.state
        if (currentRegion.latitude == null) {
            return null
        }

        const callOutWrapperStyle = keyboardHeight !== 0 ? {
            height: windowHeight - keyboardHeight - 50,
            minHeight: 260,
        } : {}

        const lastFriend = locationList[locationList.length - 1]

        const friendsNumber = lastFriend.description && lastFriend.coords 
            ? locationList.length - 1 
            : locationList.length - 2
        
        return (
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <SafeAreaConsumer>
                    {insets=> (
                        <View style={{
                            flex: 1,
                            paddingBottom: insets.bottom, 
                            paddingLeft: insets.left, 
                            paddingRight: insets.right
                        }}
                        >
                            <View style={[styles.container]}>
                                <MapView
                                    region={currentRegion}
                                    style={styles.mapStyle}
                                    showsMyLocationButton={true}
                                    showsUserLocation={true}
                                    followsUserLocation={true}
                                    mapPadding={styles.mapPadding}
                                    onPress={Keyboard.dismiss}
                                >
                                    {this.renderCircle()}

                                    {storeList.map((marker, index) => (
                                        <Marker
                                            key={index}
                                            coordinate={{
                                                latitude: parseFloat(marker.latitude),
                                                longitude: parseFloat(marker.longitude),
                                            }}
                                            title={marker.storeName}
                                            description={marker.storeAddress}
                                            pinColor={Colors.momoColor}
                                        />
                                    ))}

                                    {this.renderMarker()}
                                </MapView>
                                <Callout style={[
                                    styles.mapCallout,
                                    {paddingTop: insets.top},
                                    callOutWrapperStyle, 
                                    callOutWrapperStyle.height && Platform.OS === 'android' && 
                                        {height: callOutWrapperStyle.height - 50}
                                ]}>
                                    <View style={[styles.inputCallout]}>
                                        {collapsed ? 
                                        (
                                            <TouchableOpacity style={styles.collapsedPlace} onPress={this.toggleCallout}>
                                                <View style={styles.placeTitle}>
                                                    <Text style={{fontSize: 16, fontWeight: '700'}}>Meeting places &nbsp;</Text>
                                                    <Text style={{fontSize: 16, fontWeight: '500'}}>{`(${friendsNumber ?? 0} friends)`}</Text>
                                                </View>
                                                <View style={styles.arrowDown}>
                                                    <Animatable.View animation='fadeIn' iterationCount='infinite' direction='alternate' duration={1000}>
                                                        <Icon name='chevron-double-down' type='material-community' size={20} />
                                                    </Animatable.View>
                                                </View>
                                            </TouchableOpacity>
                                        ) 
                                        : (
                                            <View style={{flex: 1}}>
                                                <ScrollView style={{flex: 1}}>
                                                    <MapInput
                                                        currentLat={currentRegion.latitude}
                                                        currentLng={currentRegion.longitude}
                                                        inputText={locationList[0].description}
                                                        onPress={this.getCoordsFromName}
                                                        hide={true}
                                                        info={{ title: 'My location', markColor: Colors.blueMarker }}
                                                        hideAdd={true}
                                                    />
                                                    {this.renderOtherMapInput()}
                                                </ScrollView>
                                                <Divider style={styles.separator} />
                                                <View style={styles.buttonContainer}>
                                                    <Button type='solid'
                                                        title='Find meeting places'
                                                        buttonStyle={[styles.button, styles.submitButton]}
                                                        containerStyle={{flex: 1}}
                                                        titleStyle={{ fontSize: 18 }}
                                                        onPress={this.getMiddlePoint} 
                                                    />
                                                    <Button
                                                        icon={<Icon 
                                                            name='chevron-double-up' 
                                                            type='material-community' 
                                                            size={18} 
                                                            color='#fff' 
                                                        />} 
                                                        buttonStyle={[styles.button, styles.collapsedButton]}
                                                        onPress={this.toggleCallout}
                                                    />
                                                </View>
                                            </View>  
                                        )}
                                    </View>
                                </Callout>
                            </View>

                            {this.renderStoreModal()}
                            <FilterModal 
                                modalVisible={isFilterVisible}
                                categoryList={categoryList}
                                onPress={this.filter}
                                onDismiss={this.dismissModal} 
                            />
                        </View>
                    )}
                </SafeAreaConsumer>
            </KeyboardAvoidingView>
        )
    }
}

MapStore.navigationOptions = { header: null }

const styles = StyleSheet.create({
    androidSafeArea: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
    mapCallout: {
        width: '90%', 
    },
    inputCallout: {
        borderRadius: 5,
        marginVertical: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: 'white',
        borderRadius: 10,
        flex: 1,
        justifyContent: 'flex-start',
        borderColor: '#ddd',
        borderWidth: 1,

        shadowColor: "rgba(0,0,0,0.2)",
        shadowOffset: {
            width: 2,
            height: 8,
        },
        shadowOpacity: 0.5,
        zIndex: 2,
        elevation: 8,
    },
    mapStyle: {
        width: windowWidth,
        height: windowHeight,
    },
    mapPadding: {
        top: 0,
        right: 10,
        bottom: 0,
        left: 0
    },
    separator: {
        height: 2,
        backgroundColor: Colors.bgColor,
    },
    collapsedPlace: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 5
    },
    placeTitle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    arrowDown: {
        marginTop: 5
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
    },
    button: {
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
        height: 40,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        flex: 1,
    },
    collapsedButton: {
        marginLeft: 15,
        width: 40,
        backgroundColor: Colors.stumbleupon
    }
})

export default MapStore