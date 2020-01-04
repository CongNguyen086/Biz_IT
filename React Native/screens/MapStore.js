import React, { Component } from 'react'
import { StyleSheet, Dimensions, Platform, View, StatusBar, SafeAreaView, Keyboard } from 'react-native'
import MapView, { Marker, Circle, Callout } from 'react-native-maps'
import { Divider } from 'react-native-elements'
import { getDistance } from 'geolib'
// import { Svg, Circle } from 'react-native-svg'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
// Constants
import config from '../constants/config'
import Colors from '../constants/Colors'
// Components
import MapInput from '../components/MapStore/MapInput'
import LongButton from '../components/LongButton'
import MapStoreList from '../components/MapStore/MapStoreModal'
import FilterModal from '../components/MapStore/FilterModal'

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

class MapStore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRegion: {},
            currentLocation: {},
            middleCoords: {},
            storeList: [],
            inputLocationList: [],
            inputList: [1],
            currentInputText: '',
            statusBarHeight: 0,
            hideList: true,
            isStoreVisible: false,
            isFilterVisible: false,
            categoryList: [],
        }
        radius = this.props;
    }

    componentDidMount = async () => {
        radius = 1000
        await this.getPosition()
        // await this.getStoresInRange()
        setTimeout(() => this.setState({ statusBarHeight: 10 }), 5000)
    }

    getPosition = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied')
        }

        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
        let newList = this.state.inputLocationList
        newList.push({
            description: 'Vị trí của bạn',
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
            inputLocationList: newList,
            currentInputText: newList[0].description,
            // latitude: location.coords.latitude,
            // longitude: location.coords.longitude,
        });
    };

    getMiddlePoint = async () => {
        const { inputLocationList } = this.state
        const locationList = []
        inputLocationList.forEach((loc) => {
            locationList.push({
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
                locationList: locationList
            })
        })
        const middlePoint = await respond.json()
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
            }
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
                strokeWidth={0}
                // strokeColor = 'rgba(205,214,208,0.5)'
                fillColor='rgba(205,214,208,0.6)'
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

    addNewLocation = (num) => {
        const newList = this.state.inputList
        newList.push(num)
    }

    getCoordsFromName = async (fetchDetails, place_id) => {
        const res = await fetchDetails(place_id)
        const resLocation = res.geometry.location
        const currentRegion = {
            latitude: resLocation.lat,
            longitude: resLocation.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }
        const newList = this.state.inputLocationList
        newList.push({ description: res.formatted_address, coords: resLocation })
        this.setState({
            inputLocationList: newList,
            currentRegion: currentRegion
        })
        Keyboard.dismiss()
        console.log('Fetch Details: ', res)
    }

    onRegionChange = (currentRegion) => {
        this.setState({ currentRegion })
    }

    renderMarker = () => {
        const { inputLocationList } = this.state
        return (
            inputLocationList.map((marker, index) => {
                console.log('Marker: ', marker)
                let color = Colors.defaultMarkerColor
                let title = 'Vị trí của tôi'
                if (index == 0) {
                    color = Colors.blueMarker
                } else {
                    title = `Vị trí bạn số ${index}`
                }
                return (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: marker.coords.lat,
                            longitude: marker.coords.lng
                        }}
                        title={title}
                        pinColor={color}
                    />
                )
            })
        )
    }

    addNewInput = () => {
        const { inputList } = this.state
        const num = inputList.length + 1
        const newList = this.state.inputList
        newList.push(num)
        this.setState({ inputList: newList })
    }

    renderOtherMapInput = (inputList) => {
        const { currentRegion, inputLocationList } = this.state
        console.log('Result', this.state.inputLocationList)
        return (
            inputList.map((el, index) => {
                const title = `Bạn số ${el}`
                const markColor = Colors.defaultMarkerColor
                let hideAdd = true
                // Last input
                if (el == inputList.length) {
                    hideAdd = false
                }
                if (el >= inputLocationList.length) {
                    // Input has been filled
                    return (
                        <React.Fragment key={index}>
                            <Divider style={styles.separator} />
                            <MapInput
                                currentLat={currentRegion.latitude}
                                currentLng={currentRegion.longitude}
                                // inputText={inputText}
                                onPress={this.getCoordsFromName}
                                hide={false}
                                info={{ title: title, markColor: markColor }}
                                hideAdd={hideAdd}
                                onPressAdd={this.addNewInput}
                            />
                        </React.Fragment>
                    )
                }
                // Input has been empty
                return (
                    <React.Fragment key={index}>
                        <Divider style={styles.separator} />
                        <MapInput
                            currentLat={currentRegion.latitude}
                            currentLng={currentRegion.longitude}
                            inputText={inputLocationList[el].description}
                            onPress={this.getCoordsFromName}
                            hide={true}
                            info={{ title: title, markColor: markColor }}
                            hideAdd={hideAdd}
                            onPressAdd={this.addNewInput}
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
        console.log('Store List: ', storeList)
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

    render() {
        const { currentRegion, storeList, hideList, currentInputText, 
            inputList, isFilterVisible, categoryList } = this.state
        if (currentRegion.latitude == null) {
            console.log('Current: ', currentRegion)
            return null
        }
        
        return (
            <SafeAreaView style={styles.androidSafeArea} >
                <StatusBar backgroundColor='rgba(0,0,0,0.2)' barStyle='default' />
                <View style={[styles.container, { marginBottom: this.state.statusBarHeight }]}>
                    <MapView
                        region={currentRegion}
                        style={styles.mapStyle}
                        showsMyLocationButton={true}
                        showsUserLocation={true}
                        followsUserLocation={true}
                        mapPadding={styles.mapPadding}
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

                        {/* Render Marker */}
                        {this.renderMarker()}
                    </MapView>

                    <Callout style={styles.mapCallout}>
                        <View style={styles.inputCallout}>
                            <MapInput
                                currentLat={currentRegion.latitude}
                                currentLng={currentRegion.longitude}
                                inputText={currentInputText}
                                onPress={this.getCoordsFromName}
                                hide={true}
                                info={{ title: 'Vị trí của tôi', markColor: Colors.blueMarker }}
                                hideAdd={true}
                            />

                            {/* Render Other Input */}
                            {this.renderOtherMapInput(inputList)}
                            
                            <Divider style={styles.separator} />
                            <LongButton onPress={this.getMiddlePoint} />
                        </View>
                    </Callout>
                    {/* </View> */}
                </View>

                {this.renderStoreModal()}
                <FilterModal 
                    modalVisible={isFilterVisible}
                    categoryList={categoryList}
                    onPress={this.filter}
                    onDismiss={this.dismissModal} 
                />
            </SafeAreaView>
        )
    }
}

MapStore.navigationOptions = { header: null }

const styles = StyleSheet.create({
    androidSafeArea: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
    mapView: {
        flex: 1,
    },
    mapCallout: {
        width: '90%',
    },
    inputCallout: {
        borderRadius: 5,
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 8,
    },
    mapStyle: {
        width: screenWidth,
        height: screenHeight,
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
})

export default MapStore