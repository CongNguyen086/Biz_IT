import React, { Component } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Dimensions } from 'react-native'
import { connect } from 'react-redux';
import HeaderTitle from '../components/HeaderTitle';
import { Avatar } from '../components/DealDetails/StoreInfo';
import Colors from '../constants/Colors';
import { getCurrentUser } from '../services/auth/getters';
import { Button } from 'react-native-elements';

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
                    <Avatar data={{ icon: "https://i.imgur.com/uvWE1Jy.png" }} />
                    <View style={styles.infoContainer}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.title}>User name:</Text>
                            <Text style={styles.text}>{fullName}</Text>
                        </View>
                        <View style={styles.valueContainer}>
                            <Text style={styles.title}>Phone:</Text>
                            <Text style={styles.text}>{userPhone}</Text>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button type='solid'
                            title='Edit'
                            buttonStyle={styles.button}
                            titleStyle={{ fontSize: 18 }} />
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
        padding: 20,
        paddingTop: 70,
        backgroundColor: '#fff'
    },
    infoContainer: {
        marginVertical: 30,
        flex: 0.1
    },
    fieldContainer: {
        flex: 0.5,
        flexDirection: "row",
        justifyContent: "center"
    },
    valueContainer: {
        flex: 0.5,
        flexDirection: "row",
        justifyContent: "center"
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
    buttonContainer: {
        justifyContent: "flex-start",
    },
    button: {
        backgroundColor: Colors.primary,
        borderRadius: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 1,
    },
    // card: {
    //     flex: 1,
    //     backgroundColor: '#fff',
    //     padding: 10,
    //     borderRadius: 3,
    // },
    // tabBarContainer: {
    //     backgroundColor: '#C4C4C4',
    //     borderRadius: 20,
    // },
    // activeTab: {
    //     borderRadius: 20,
    //     backgroundColor: 'transparent',
    //     margin: 2,
    //     minHeight: 40,
    // }
})