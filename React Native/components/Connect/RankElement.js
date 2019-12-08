import React from 'react';
import { Text, Image, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ListItem } from 'react-native-elements';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

const RankElement = (props) => {
    return (
        <TouchableOpacity>
            <ListItem
                containerStyle={{ borderBottomWidth: 1, borderBottomColor: '#D2D7E0', paddingHorizontal: 0, marginHorizontal: wp(4) }}
                leftElement={<Image style={{ height: hp(4), width: wp(6) }} source={props.source} />}
                leftAvatar={{
                    source: require('../../assets/avatars/avatar.png')
                }}
                title={props.name}
                subtitle={
                    <ListItem
                        containerStyle={{ padding: 0 }}
                        leftElement={<Text style={{ fontSize: hp(2), color: "#959595", fontWeight: 'bold' }}><Image source={require('../../assets/icons/connect.png')} style={{marginHorizontal: wp(2), height: hp(2), width: wp(4) }} /> {props.numbers}</Text>}
                        rightElement={<Text style={{ fontSize: hp(2), color: "#959595" }}>0 <AntDesign name="hearto" size={hp(2)} color="#959595" /></Text>}
                    />
                }
            />
        </TouchableOpacity>
    )
}

export default RankElement
