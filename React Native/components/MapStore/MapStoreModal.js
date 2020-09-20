import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
// Constants
import Colors from '../../constants/Colors'
// Components
import StoreList from '../MapStore/StoreList';
import SlidingUpPanel from '../SlidingUpPanel';
import {SafeAreaConsumer} from 'react-native-safe-area-context'
const screenHeight = Dimensions.get('window').height

class MapStoreList extends Component {
    constructor(props) {
        super(props)
        this._panel = null;
    }
    componentDidMount = () => {
        this._panel.show(300)
    }

    render() {
        const { data, onPress } = this.props
        return (
            <SafeAreaConsumer>
                {insets => (
                    <SlidingUpPanel ref={c => this._panel = c}
                        draggableRange={{ top: screenHeight - (insets.bottom + insets.top + 65), bottom: 65 }}
                    >
                        <View style={styles.container}>
                            <View style={styles.headerTitle}>
                                <Text style={styles.label}>Meeting places for your group</Text>
                                <TouchableOpacity style={styles.filterView} onPress={() => onPress()}>
                                    <Icon name='filter' type='font-awesome' color={Colors.extraText} />
                                    <Text style={styles.filter}>Filter</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{marginTop: 25, flex: 1,}}>
                                <StoreList data={data} />
                            </View>
                        </View>
                    </SlidingUpPanel>
                )}
            </SafeAreaConsumer>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: 1,
        backgroundColor: 'white',
        elevation: 10,
    },
    dragHandler: {
        alignSelf: 'stretch',
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    filterView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    filter: {
        fontSize: 18,
        color: Colors.extraText,
        marginLeft: 5,
    },
})

export default MapStoreList