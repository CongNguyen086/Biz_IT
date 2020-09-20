import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Colors from "../constants/Colors";

class HeaderTitle extends Component {
    render() {
        const { title } = this.props;

        return (
            <View style={styles.container}>
                <Text style={styles.headerTitle}>{title}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: hp(2.5),
        fontWeight: '500',
        color: '#fff',
    },
});

export default HeaderTitle;