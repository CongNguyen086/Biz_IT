import React, { Component } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

import { StoreInfo, Avatar  } from './StoreInfo';

class StoreList extends Component {
    renderList = ({ item }) => (
        <ListItem
            containerStyle={styles.listItem}
            contentContainerStyle={{ flex:0.02 }}
            leftElement={<Avatar data={item} />}
            rightElement={<StoreInfo data={item} />}
            pad={3}
            onPress={() => {
                this.props.navigation.navigate('StoreProfile', {
                    info: item,
                })
                
            }}
        />
    );
    
    renderKeyExtractor = (item, index) => index.toString();
    
    renderSeparator = () => {
        return (
            <View style={styles.separator} />
        );
    };
    render() {
        const { data } = this.props;
        return (
            <Card containerStyle={styles.container}>
                <FlatList
                    data={data}
                    renderItem={this.renderList}
                    keyExtractor={this.renderKeyExtractor}
                    ItemSeparatorComponent={this.renderSeparator}
                />
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: -1,
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
    },
});

export default withNavigation(StoreList);