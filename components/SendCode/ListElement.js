import React, {useState} from 'react';
import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

export default function ListElement(props) {
    const [radio, setRadio] = useState('md-radio-button-off')
    const getStatus = () => {
        if(radio == 'md-radio-button-off') {
            setRadio('md-radio-button-on')
        } else setRadio('md-radio-button-off')
    } 
    return (
        <TouchableOpacity onPress={getStatus} >
            <ListItem
                leftAvatar={{ source: require('../../assets/avatars/avatar.png') }}
                title={props.name}
                subtitle={props.phone}
                style={styles.list}
                leftElement={<Ionicons name={radio} color='#0076FF' size={22} />}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    list: {
        borderBottomWidth: 1,
        borderBottomColor: 'grey'
    }
});
