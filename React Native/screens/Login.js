import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Alert,
  Keyboard
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import FBLoginButton from '../components/FBLoginButton';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Facebook from 'expo-facebook';
// Constants
import ROOT from '../constants/Root';

const BG_IMAGE = require('../assets/images/login_background.png');

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: '',
      phone: '',
      phone_valid: true,
      password: '',
      login_failed: false,
      showLoading: false,
    };
  }

  validatePhone(phone) {
    var re = /^\d*$/;

    return re.test(phone);
  }

  submitLoginCredentials() {
    const { showLoading } = this.state;

    this.setState({
      showLoading: !showLoading,
    });
  }

  async _signInAsync(userId) {
    await AsyncStorage.removeItem('@userToken')
    await AsyncStorage.setItem('@userToken', userId);
    this.props.navigation.navigate('Loading');
  };

  async _checkLogin() {
    const { phone, password, showLoading } = this.state;
    this.setState({ showLoading: !showLoading });
    Keyboard.dismiss();
    // await AsyncStorage.clear();
    const response = await fetch(ROOT + `/login?phone=${phone}&password=${password}`);
    const jsonData = await response.json();
    console.log(jsonData[0])
    if (jsonData[0] != null) {
      this._signInAsync(jsonData[0].userId);
    } else {
      this.setState({
        showLoading: false,
      }, () => Alert.alert('Logged in failed', `Please check your phone/password`));
    }

  };

  async loginFacebook() {
    try {
      const {
        type,
        token,
      } = await Facebook.logInWithReadPermissionsAsync('795764707522976', 
      {
        permissions: [
          'public_profile',

          // 'manage_pages', 
          // 'publish_pages',
        ],        
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        console.log(response);
        Alert.alert('Đăng nhập thành công!', `Xin chào ${(await response.json()).name}!`);
        // this.props.navigation.navigate('Loading');
      } else {
        // type === 'cancel'
        Alert.alert('Failed!', `Check your info`);
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  async shareFacebook() {
    await Facebook.shareFacebook()
  }

  render() {
    const { phone, password, phone_valid, showLoading } = this.state;
    // console.log(SCREEN_HEIGHT);
    return (
      <View style={styles.container}>
        <ImageBackground source={BG_IMAGE} style={styles.bgImage}>
          <View style={styles.loginView}>
            <View style={styles.loginInput}>
              <Input
                leftIcon={
                  <Icon
                    name="user-o"
                    type="font-awesome"
                    color="rgba(171, 189, 219, 1)"
                    size={hp(3)}
                  />
                }
                containerStyle={{ marginVertical: hp(1.5) }}
                onChangeText={phone => this.setState({ phone: phone })}
                value={phone}
                inputStyle={{ marginLeft: wp(3), color: 'white' }}
                keyboardAppearance="light"
                placeholder="Số điện thoại"
                autoFocus={false}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="number-pad"
                returnKeyType="next"
                ref={input => (this.emailInput = input)}
                onSubmitEditing={() => {
                  this.setState({ phone_valid: this.validatePhone(phone) });
                  this.passwordInput.focus();
                }}
                blurOnSubmit={false}
                placeholderTextColor="#E5E5E5"
                errorStyle={{ textAlign: 'center', fontSize: hp(2) }}
                errorMessage={
                  phone_valid ? null : 'Please enter a valid email address'
                }
              />
              <Input
                leftIcon={
                  <Icon
                    name="lock"
                    type="font-awesome"
                    color="rgba(171, 189, 219, 1)"
                    size={hp(3)}
                  />
                }
                containerStyle={{ marginVertical: hp(1.5) }}
                onChangeText={password => this.setState({ password })}
                value={password}
                inputStyle={{ marginLeft: wp(4), color: 'white' }}
                secureTextEntry={true}
                keyboardAppearance="light"
                placeholder="Mật khẩu"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="number-pad"
                returnKeyType="done"
                ref={input => (this.passwordInput = input)}
                blurOnSubmit={true}
                placeholderTextColor="#E5E5E5"
              />
            </View>
            <View style={styles.plusView}>
              <Button
                title="Quên mật khẩu?"
                type="clear"
                activeOpacity={0.5}
                titleStyle={styles.plusTitle}
                // containerStyle={styles.plusText}
                onPress={() => console.log('You press forgot password')}
              />
            </View>
            <Button
              title="TIẾP TỤC"
              activeOpacity={1}
              underlayColor="transparent"
              onPress={() => this._checkLogin()}
              loading={showLoading}
              loadingProps={{ size: 'small', color: 'white' }}
              disabled={!phone_valid && password.length < 8}
              buttonStyle={{
                height: hp(6),
                width: wp(74),
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 30,
              }}
              containerStyle={styles.nextButton}
              titleStyle={{ fontWeight: 'bold', color: 'white' }}
            />
            <View style={styles.footerView}>
              <View style={styles.loginFBView}>
                <View style={styles.plusOrView}>
                  <Text style={styles.plusTitle}>Hoặc</Text>
                </View>
                <View style={styles.facebookButton}>
                  <FBLoginButton loginWithFacebook={this.loginFacebook} />
                </View>
              </View>
              <View style={styles.signUpView}>
                <Text style={styles.signUpText}>Đăng Ký</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    alignItems: 'center',
    resizeMode: 'stretch',
  },
  loginView: {
    flex: 1,
    marginTop: hp(38),
    backgroundColor: 'transparent',
    width: wp(75),
  },
  loginInput: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusView: {
    flex: 0.14,
    alignItems: 'flex-end',
    // marginTop: hp(0),
  },
  nextButton: {
    flex: 0.06,
    // marginTop: hp(0),
  },
  plusTitle: {
    fontFamily: 'Roboto',
    color: '#CCCCCC',
    fontSize: hp(2),
  },
  footerView: {
    marginTop: hp(10),
    flex: 0.6,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plusOrView: {
    width: wp(75),
    borderTopColor: '#979aa2',
    borderTopWidth: 1,
    paddingTop: hp(2),
    alignItems: 'center',
  },
  loginFBView: {
    flex: 0.8,
    alignItems: 'center',
  },
  facebookButton: {
    marginTop: hp(2),
  },
  signUpView: {
    flex: 0.2,
    alignItems: 'center',
  },
  signUpText: {
    color: '#CCCCCC',
    fontSize: hp(2),
    fontWeight: 'bold',
  },
});
