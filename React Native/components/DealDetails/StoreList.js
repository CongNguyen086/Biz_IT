import React, { Component } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

import { StoreInfo, Avatar  } from './StoreInfo';

class StoreList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categoryName: ''
        }
    }
    componentDidMount() {
        this.getCategory(this.props.categoryId)
    }
    getCategory = async (categoryId) => {
        const response = await fetch(ROOT + `/getcategory?categoryId=${categoryId}`);
        const jsonData = await response.json();
        this.setState({ categoryName: jsonData[0].categoryName})
    }
    renderList = ({ item }) => (
        <ListItem
            containerStyle={styles.listItem}
            contentContainerStyle={{ flex:0.02 }}
            leftElement={<Avatar data={item} />}
            rightElement={<StoreInfo data={item} categoryName={this.state.categoryName} />}
            pad={3}
            onPress={() => {
                this.props.navigation.navigate('StoreProfile', {
                    info: item,
                    categoryName: this.state.categoryName
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