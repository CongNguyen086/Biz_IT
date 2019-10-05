import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';

export default function MemberList() {
    return (
        <View style={styles.member}>
            <Image source={require('../../assets/avatars/avatar.png')} />
            <Text>Khang</Text>
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
