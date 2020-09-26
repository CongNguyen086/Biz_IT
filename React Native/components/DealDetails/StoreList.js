import React, { Component } from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { withNavigation } from 'react-navigation';
// Components
import { StoreInfo, Avatar  } from './StoreInfo';

class StoreList extends Component {
    constructor(props) {
        super(props)
    }
    renderList = ({ item }) => {
        const {name: categoryName} = this.props?.category || {}

        return (
            <ListItem
                containerStyle={styles.listItem}
                contentContainerStyle={{ flex:0.01 }}
                leftElement={<Avatar data={item} />}
                rightElement={<StoreInfo data={item} categoryName={categoryName} />}
                pad={3}
                onPress={() => {
                    this.props.navigation.navigate('StoreProfile', {
                        store: {...item, categoryName: categoryName},
                    })
                }}
            />
        )
    }
    
    render() {
        const {loading, stores} = this.props
        if (loading) {
            return (
                <Card containerStyle={styles.container}>
                    <ActivityIndicator size="large" color="purple" style={{marginTop: hp(10)}}/>
                </Card>
            );
        }
        return (
            <Card containerStyle={styles.container}>
                <FlatList
                    data={stores}
                    renderItem={this.renderList}
                    keyExtractor={(item, index) => item.storeId}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: -8,
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
    listItem: {
        flex: 1,
        height: 120,
        paddingHorizontal: 0,
    },
    separator: {
        height: 1,
        backgroundColor: "#E8E9E9",
    },
});

export default withNavigation(StoreList);