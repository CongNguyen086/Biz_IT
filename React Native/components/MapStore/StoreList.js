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
            containerStyle={styles.listItem}
            contentContainerStyle={{ flex:0.02 }}
            leftElement={<Avatar data={item} />}
            rightElement={<StoreInfo data={item} />}
            pad={3}
            onPress={() => {
                this.props.navigation.navigate('StoreProfile', {
                    info: item,
                    categoryName: item.categoryName
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
        borderWidth: 0,
    },
    listItem: {
        flex: 1,
        height: 120,
    },
    separator: {
        height: 1,
        backgroundColor: "#E8E9E9",
    },
});

export default withNavigation(StoreList);