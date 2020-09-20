import React, { Component } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
// Components
import { StoreInfo, Avatar  } from './StoreInfo';

class StoreList extends Component {
    constructor(props) {
        super(props)
    }
    
    renderList = ({ item }) => (
        <ListItem
            bottomDivider
            containerStyle={styles.listItem}
            contentContainerStyle={{ flex:0.02 }}
            leftElement={<Avatar data={item} />}
            rightElement={<StoreInfo data={item} />}
            pad={3}
            onPress={() => {
                this.props.navigation.navigate('StoreProfile', {
                    store: {...item, categoryName: null},
                })
                
            }}
        />
    );
    
    render() {
        const { data } = this.props;
        return (
            <FlatList
                data={data}
                renderItem={this.renderList}
                keyExtractor={(item) => `${item.storeId}`}
            />
        );
    }
}

const styles = StyleSheet.create({
    listItem: {
        flex: 1,
    },
});

export default withNavigation(StoreList);