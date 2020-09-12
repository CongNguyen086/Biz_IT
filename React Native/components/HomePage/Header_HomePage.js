import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { withNavigation } from 'react-navigation';
//Component
import Search_HomePage from './Search_HomePage'

function Header_HomePage() {
    return (
        <View style={styles.container}>
            <ImageBackground style={styles.header} source={require('../../assets/Header_HomePage/leaves.jpg')} blurRadius={2}>
                <View style={styles.searchContainer}>
                    <Search_HomePage />
                    <TouchableOpacity>
                        <MaterialCommunityIcons name='bell-ring-outline' size={hp(3)} color="white" style={{ opacity: 1 }} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialCommunityIcons name='power' size={hp(3)} color="white" style={{ marginRight: wp(3), opacity: 1 }} />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        width: '100%',
        paddingVertical: 15
    },
    searchContainer: {
        width: wp(100),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
});

export default withNavigation(Header_HomePage)
