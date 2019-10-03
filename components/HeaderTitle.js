import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default HeaderTitle;