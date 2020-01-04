import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Keyboard, TouchableOpacity, FlatList, Image, AsyncStorage } from 'react-native';
import { AirbnbRating, Button } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// Constant
import Colors from '../../constants/Colors';
import config from '../../constants/config';

class ReviewProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageList: [],
            defaultRating: 0,
            rating: 0,
            text: '',
            pressed: false
        }
    }

    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1
        });
        if (!result.cancelled) {
            let newList = {
                uri: result.uri,
            }
            if (newList !== null && newList !== '') {
                let imageList = [...this.state.imageList, newList]
                this.setState({ imageList })
            }
        }
    }

    updateStoreRating = async (storeId) => {
        const getResponse = await fetch(config.ROOT + `/getstorerating?storeId=${storeId}`);
        const getData = await getResponse.json();

        const putResponse = await fetch(config.ROOT + `/updatestorerating?storeRating=${getData[0].rating}&storeId=${storeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const putData = await putResponse.json();
    }

    clearText = async (storeId) => {
        const userId = await AsyncStorage.getItem('@userToken');
        const response = await fetch(config.ROOT + `/sendreview?rating=${this.state.rating}&comment=${this.state.text}&userId=${userId}&storeId=${storeId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        });
        const jsonData = await response.json();
        this._uploadImage(jsonData.insertId)
        // console.log(jsonData)
        Alert.alert('Cảm ơn bạn', 'Góp ý của bạn đã được ghi nhận')
        this.textInput.clear();
        Keyboard.dismiss();
        this.updateStoreRating(storeId);
        this.setState({pressed: true})
        this.setState({defaultRating: 0})
    }

    _uploadImage = (reviewId) => {
        this.state.imageList.forEach(async element => {
            let localUri = element.uri;
            let filename = localUri.split('/').pop();

            // Infer the type of the image
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;

            let data = new FormData();
            data.append('upload', { uri: localUri, name: filename, type })
            const response = await fetch(config.ROOT + `/upload?reviewId=${reviewId}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: data
            });
            const jsonData = await JSON.stringify(response);
            console.log(jsonData)
        })
    }

    ratingCompleted = (rating) => {
        this.setState({ rating: rating })
        this.setState({ defaultRating: rating})
    }

    render() {
        const { name, star, address, distance, storeId } = this.props;
        let { imageList } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerLabel}>Trải nghiệm tại quán của bạn {'\n'} như thế nào</Text>
                </View>
                <View style={styles.rateGroup}>
                    <AirbnbRating
                        showRating={false}
                        defaultRating={this.state.defaultRating}
                        onFinishRating={this.ratingCompleted}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputStyle}
                        multiline
                        editable
                        numberOfLines={5}
                        maxLength={500}
                        placeholder='Hãy nói lên những suy nghĩ của bạn về chúng tôi'
                        ref={input => { this.textInput = input }}
                        onChangeText={(text) => this.setState({ text })}
                        value={this.state.text}
                    />
                </View>
                <View style={styles.footerContainer}>
                    <TouchableOpacity style={styles.importImage} onPress={this._pickImage}>
                        <Text style={{ color: '#AE2070' }}>+Thêm{'\n'}Hình Ảnh</Text>
                    </TouchableOpacity>
                    <View style={styles.listImage}>
                        <FlatList
                            data={imageList}
                            renderItem={({ item }) => <Image source={{ uri: item.uri }} style={{ width: wp(20), height: hp(10), borderRadius: 8, marginRight: wp(1.5) }} />}
                            keyExtractor={item => item.uri}
                            horizontal={true}
                        />
                    </View>
                    <View style={styles.buttonSendContainer}>
                        <Button title='Gửi' titleStyle={{ fontSize: hp(2) }}
                            buttonStyle={styles.buttonSend}
                            disabled={this.state.pressed}
                            onPress={() => this.clearText(storeId)} />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
    },
    headerContainer: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerLabel: {
        fontSize: hp(2.5),
        fontWeight: 'bold',
        textAlign: 'center'
    },
    rateGroup: {
        flex: 0.1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    rate: {
        alignItems: 'flex-start',
    },
    inputContainer: {
        flex: 0.42,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputStyle: {
        height: '95%',
        width: '95%',
        backgroundColor: '#F5F5F5',
        borderRadius: 5,
        textAlignVertical: 'top',
        padding: hp(2)

    },
    footerContainer: {
        flex: 0.28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    importImage: {
        flex: 0.2,
        width: '80%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        margin: hp(2),
        borderRadius: 5,
        borderColor: '#AE2070',
        borderWidth: 2,
        borderStyle: 'dotted'
    },
    listImage: {
        flex: 0.5,
        justifyContent: 'center',
        margin: hp(2)
    },
    buttonSendContainer: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonSend: {
        backgroundColor: '#AE2070',
        paddingLeft: wp(5),
        paddingRight: wp(5)
    }
});

export default ReviewProfile;