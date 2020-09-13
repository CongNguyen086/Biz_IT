import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, Text, TouchableOpacity } from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { MaterialIcons } from '@expo/vector-icons';
// Constants
import Colors from '../../constants/Colors'
// Components
import StoreList from '../MapStore/StoreList';

const screenHeight = Dimensions.get('window').height

class MapStoreList extends Component {
    componentDidMount = () => {
        this._panel.show(300)
    }

    render() {
        const { data, onPress } = this.props
        return (
            <SlidingUpPanel ref={c => this._panel = c}
                draggableRange={{ top: screenHeight - 50, bottom: 65 }}
                friction={0.05}
            // animatedValue={this._draggedValue}
            // snappingPoints={[360]}
            // height={height + 180}
            >
                {/* {dragHandler => ( */}
                <View style={styles.container}>
                    <View style={styles.dragHandler}>
                        <MaterialIcons name='drag-handle' size={25} color='#C4C4C4' />
                    </View>
                    <View style={styles.headerTitle}>
                        <Text style={styles.label}>Meeting places for your group</Text>
                        <TouchableOpacity style={styles.filterView} onPress={() => onPress()}>
                            <Icon name='filter' type='font-awesome' color={Colors.extraText} />
                            <Text style={styles.filter}>Filter</Text>
                        </TouchableOpacity>
                    </View>

                    <Divider style={styles.separator} />
                    <StoreList data={data} />
                </View>
                {/* )} */}
            </SlidingUpPanel>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: 1,
        backgroundColor: 'white',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
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
    separator: {
        height: 2,
        backgroundColor: Colors.bgColor,
        marginHorizontal: 20,
        marginTop: 10,
    },
})

export default MapStoreList