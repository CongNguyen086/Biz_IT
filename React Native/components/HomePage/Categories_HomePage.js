import React from 'react';
import { Image } from 'react-native';

export default function Categories_HomePage() {
    return (
        <Image style={{flex: 1,aspectRatio: 1.5, resizeMode: 'contain'}} source={require('../../assets/Categories_HomePage/Body.png')} />
    );
}
