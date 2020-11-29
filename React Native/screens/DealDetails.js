import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert
} from 'react-native';
import { Icon } from 'react-native-elements'
import { getDistance } from 'geolib';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
// Constants
import HeaderTitle from '../components/HeaderTitle';
import Colors from '../constants/Colors';
import config from '../constants/config';
// Components
import DealInfo from '../components/DealDetails/DealInfo';
import StoreList from '../components/DealDetails/StoreList';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';

const FILTER_OPTIONS = {
    DISTANCE: 'DISTANCE',
    RATING: 'RATING'
}

class DealDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            stores: [],
            category: null,
            latitude: null,
            longitude: null,
            filter: FILTER_OPTIONS.DISTANCE
        }
        this.passedData = this.props.navigation.getParam('info', 'No info');
    }

    componentDidMount() {
        this.fetchData()
    }

    async fetchData() {
        try {
            if (!this.state.loading) {
                this.setState({
                    loading: true
                })
            }
            const [stores, location, categoryName] = await Promise.all([
                this.getStoreDealList(),
                this.getPosition(),
                this.getCategoryName()
            ])

            this.setState({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                category: {
                    id: this.passedData.categoryId,
                    name: categoryName,
                }
            }, () => {
                const sortedStores = this.sortStore(stores, this.compareByDistance)
                this.setState({
                    stores: sortedStores,
                    loading: false,
                })
            });

        }
        catch(e) {
            Alert.alert('Error:', e.message || 'Error occurs.')
        }
    }

    async getCategoryName(categoryId) {
        const response = await fetch(config.ROOT + `/getcategory?categoryId=${categoryId}`);
        const jsonData = await response.json();
        return jsonData?.[0]?.categoryName
    }

    async getStoreDealList() {
        const response = await fetch(config.ROOT + `/getstorepromotion?dealId=${this.passedData.dealId}`)
        const stores = await response.json();
        console.log("DealDetails -> getStoreDealList -> stores", stores)

        return stores;
    }

    async getPosition() {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            throw new Error('You must grant permission to get current location!')
        }

        console.log("DealDetails -> getPosition -> await Location.getCurrentPositionAsync({})", await Location.getCurrentPositionAsync({}))
        return await Location.getCurrentPositionAsync({});
    };

    compareByDistance = (store1, store2) => {
        const store1Distance = getDistance(
            {
                latitude: store1.latitude,
                longitude: store1.longitude
            },
            {
                latitude: this.state.latitude,
                longitude: this.state.longitude
            }
        )
        const store2Distance = getDistance(
            {
                latitude: store2.latitude,
                longitude: store2.longitude
            },
            {
                latitude: this.state.latitude,
                longitude: this.state.longitude
            }
        )
        store1.distance = store1Distance
        store2.distance = store2Distance
        return store1Distance - store2Distance;
    }

    compareByRating = (store1, store2) => {
        return store2.storeRating - store1.storeRating
    }

    sortStore(stores = [], compareFunction = () => {}) {
        const sorted = [...(stores || [])]
        const {topServiceId} = this.passedData || {}

        sorted.sort(compareFunction)

        const topServiceStores = sorted.filter(store => store.serviceId === topServiceId);
        const otherStores = sorted.filter(store => store.serviceId !== topServiceId);
        return [...topServiceStores, ...otherStores]
    }

    onFilterSelect = (value) => {
        const {filter, stores} = this.state
        if (filter !== value) {
            let sorted = []
            let compareFunction = undefined
            switch(value) {
                case FILTER_OPTIONS.DISTANCE:
                    compareFunction = this.compareByDistance
                    break
                case FILTER_OPTIONS.RATING:
                    compareFunction = this.compareByRating
                    break
            }

            if (typeof compareFunction !== 'undefined') {
                sorted = this.sortStore(stores, compareFunction)
                this.setState({
                    stores: sorted,
                    filter: value,
                })
            }
        }
    }

    static navigationOptions = {
        headerTitle: <HeaderTitle title='Cafe/Dessert' />,
    };

    render() {
        const {stores, loading, category} = this.state
        const {image} = this.passedData
        return (
            <View style={styles.container}>
                <View style={styles.dealInfo}>
                    <DealInfo 
                        image={{ uri: image}}
                    />
                </View>
                <View style={styles.filterWrapper}>
                    <Menu onSelect={this.onFilterSelect}>
                        <MenuTrigger>
                            <View style={styles.filterView}>
                                <Icon name='filter' type='font-awesome' color={Colors.extraText} size={16} />
                                <Text style={styles.filter}>Filter</Text>
                                <Icon name='angle-down' type='font-awesome' size={16} color={Colors.extraText} />
                            </View>
                        </MenuTrigger>
                        <MenuOptions customStyles={{optionsWrapper: styles.optionsWrapper}}>
                            <MenuOption value={FILTER_OPTIONS.DISTANCE} customStyles={{optionWrapper: styles.optionStyle}}>
                                <Text>Distance</Text>
                            </MenuOption>
                            <MenuOption value={FILTER_OPTIONS.RATING} customStyles={{optionWrapper: {
                                ...styles.optionStyle,
                                ...{borderBottomWidth: 0}}
                            }}>
                                <Text>Rating</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </View>
                <View style={styles.storeList}>
                    <StoreList 
                        stores={stores}
                        loading={loading}
                        category={category}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgColor,
    },
    filterView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 10,
    },
    filter: {
        fontSize: 16,
        color: Colors.extraText,
        marginHorizontal: 5,
    },
    storeList: {
        flex: 1,
    },
    filterWrapper: {
        paddingVertical: 15,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    optionsWrapper: {
        marginRight: 10,
    },
    optionStyle: {
        paddingHorizontal: 10,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    }
});

export default DealDetails;