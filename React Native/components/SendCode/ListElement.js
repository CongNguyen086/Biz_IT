import React, { useState } from 'react';
import { StyleSheet, Image, View, Text, TouchableOpacity, AsyncStorage, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

export default function ListElement(props) {
    const [radio, setRadio] = useState('md-radio-button-off')
    const [contacts, setContacts] = useState([])
    const getStatus = async () => {
        try {
            if (radio == 'md-radio-button-off') {
                // const newFriend = JSON.parse(await AsyncStorage.getItem('friendList'))
                // newFriend.push(props.name)
                // await AsyncStorage.setItem('friendList', JSON.stringify(newFriend))
                setRadio('md-radio-button-on')
            } else setRadio('md-radio-button-off')    
        } catch (error) {
            console.log(error)
        }
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
