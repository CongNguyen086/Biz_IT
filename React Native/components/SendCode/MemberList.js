import React from 'react';
import { StyleSheet, Image, View, Text, FlatList } from 'react-native';
// import { ListItem } from 'react-native-elements';

export default function MemberList(props) {
    return (
        <View style={styles.member}>
            <Image source={require('../../assets/avatars/avatar.png')} />
            <Text>{props.name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    member: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
    },
});
