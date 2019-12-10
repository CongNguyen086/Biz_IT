import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, Text, TouchableHighlight, Modal, FlatList } from 'react-native';
import { Divider, Icon, ListItem } from 'react-native-elements';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import { withNavigation } from 'react-navigation';
// Constants
import Colors from '../../constants/Colors'

const screenHeight = Dimensions.get('window').height

class FilterModal extends Component {
    renderKeyExtractor = (item, index) => index.toString();

    render() {
        const { modalVisible, categoryList, onPress, onDismiss } = this.props

        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableHighlight style={styles.left} onPress={() => onDismiss()}>
                            <Ionicons name='md-close' size={27} />
                        </TouchableHighlight>
                        <View style={styles.center}>
                            <Text style={styles.title}>Danh mục</Text>
                        </View>
                        <View style={styles.right}>
                            <Ionicons name='md-close' size={27} color='white' />
                        </View>
                    </View>

                    <View style={styles.body}>
                        <FlatList 
                            data={categoryList}
                            renderItem={({item}) => (
                                <ListItem 
                                    key={item.categoryId}
                                    title={item.categoryName}
                                    bottomDivider
                                    onPress={() => onPress(item.categoryId)}
                                />
                            )}
                            keyExtractor={this.renderKeyExtractor}
                        />
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderColor: "#E8E9E9",
    },
    body: {
        height: screenHeight - 100
    },
    left: {
        flex: 0.2,
    },
    center: {
        flex: 0.6,
        alignItems: 'center',
    },
    right: {
        flex: 0.2,
    },
    title: {
        fontSize: hp(2.5),
        fontWeight: 'bold',
    },
})

export default FilterModal