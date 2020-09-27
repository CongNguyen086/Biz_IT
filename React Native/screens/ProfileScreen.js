import React, { Component } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Dimensions } from 'react-native'
import { TabView, SceneMap, TabBar, TabBarItem } from 'react-native-tab-view';
import { connect } from 'react-redux';
import HeaderTitle from '../components/HeaderTitle';
import { Avatar } from '../components/MapStore/StoreInfo';
import Colors from '../constants/Colors';
import { getCurrentUser } from '../services/auth/getters';

const initialLayout = { width: Dimensions.get('window').width };

class Profile extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { currentUser: { fullName, userPhone } } = this.props
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#EDEEEE', }}>
                <View style={styles.container}>
                    <Avatar data={{ icon: "https://imgur.com/uvWE1Jy" }} />
                    <View style={styles.infoContainer}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.title}>User name</Text>
                            <Text style={styles.text}>{fullName}</Text>
                        </View>
                        <View style={styles.valueContainer}>
                            <Text style={styles.title}>Phone</Text>
                            <Text style={styles.text}>{userPhone}</Text>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

Profile.navigationOptions = {
    headerTitle: <HeaderTitle title='My profile' />,
}

const mapStateToProps = state => {
    return {
        currentUser: getCurrentUser(state)
    }
}

export default connect(mapStateToProps, null)(Profile);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 20,
        backgroundColor: '#fff'
    },
    infoContainer: {
        marginVertical: 10,
        flex: 1,
    },
    fieldContainer: {
        width: "50%",
        flex: 1,
        alignItems: "flex-end"
    },
    valueContainer: {
        width: "50%",
        flex: 1,
        alignItems: "flex-start"
    },
    title: {
        color: Colors.primary,
        fontWeight: '600',
        fontSize: 18,
        minWidth: 100,
    },
    text: {
        color: Colors.extraText,
        fontWeight: '500',
        fontSize: 18,
        marginLeft: 10,
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 3,
    },
    tabBarContainer: {
        backgroundColor: '#C4C4C4',
        borderRadius: 20,
    },
    activeTab: {
        borderRadius: 20,
        backgroundColor: 'transparent',
        margin: 2,
        minHeight: 40,
    }
})