import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  Alert,
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import FBLoginButton from '../components/FBLoginButton';
import * as Facebook from 'expo-facebook';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BG_IMAGE = require('../assets/images/login_background.png');

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: '',
      phone_valid: true,
      password: '',
      login_failed: false,
      showLoading: false,
    };
  }

  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
  }

  submitLoginCredentials() {
    const { showLoading } = this.state;

    this.setState({
      showLoading: !showLoading,
    });
  }

  async loginFacebook() {
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync('621612031578384', {
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        Alert.alert('Logged in!', `Hi ${(await response.json()).name}, you're such a handsome guy!`);
      } else {
        // type === 'cancel'
        Alert.alert('Failed!', `Check your info`);
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  render() {
    const { phone: email, password, phone_valid: email_valid, showLoading } = this.state;
    console.log(SCREEN_HEIGHT);
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
                    size={25}
                  />
                }
                containerStyle={{ marginVertical: 10 }}
                onChangeText={email => this.setState({ email })}
                value={email}
                inputStyle={{ marginLeft: 10, color: 'white' }}
                keyboardAppearance="light"
                placeholder="Số điện thoại"
                autoFocus={false}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                ref={input => (this.emailInput = input)}
                onSubmitEditing={() => {
                  this.setState({ email_valid: this.validateEmail(email) });
                  this.passwordInput.focus();
                }}
                blurOnSubmit={false}
                placeholderTextColor="#E5E5E5"
                errorStyle={{ textAlign: 'center', fontSize: 12 }}
                errorMessage={
                  email_valid ? null : 'Please enter a valid email address'
                }
              />
              <Input
                leftIcon={
                  <Icon
                    name="lock"
                    type="font-awesome"
                    color="rgba(171, 189, 219, 1)"
                    size={25}
                  />
                }
                containerStyle={{ marginVertical: 10 }}
                onChangeText={password => this.setState({ password })}
                value={password}
                inputStyle={{ marginLeft: 15, color: 'white' }}
                secureTextEntry={true}
                keyboardAppearance="light"
                placeholder="Mật khẩu"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="default"
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
              onPress={this.submitLoginCredentials.bind(this)}
              loading={showLoading}
              loadingProps={{ size: 'small', color: 'white' }}
              disabled={!email_valid && password.length < 8}
              buttonStyle={{
                height: 50,
                width: 300,
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
                <Text style={styles.signUpText}>Đăng nhập</Text>
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
    top: 0,
    left: 0,
    alignItems: 'center',
    resizeMode: 'stretch',
  },
  loginView: {
    flex: 1,
    marginTop: 300,
    backgroundColor: 'transparent',
    width: 300,
    // height: 400,
  },
  loginInput: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // loginTitle: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // travelText: {
  //   color: 'white',
  //   fontSize: 30,
  //   fontWeight: 'bold',
  // },
  plusView: {
    // justifyContent: 'flex-end',
    flex: 0.14,
    alignItems: 'flex-end',
    marginTop: -5,
  },
  nextButton: {
    flex: 0.06,
    marginTop: -10,
  },
  plusTitle: {
    fontFamily: 'Roboto',
    color: '#CCCCCC',
    fontSize: 15,
  },
  footerView: {
    marginTop: 80,
    flex: 0.6,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plusOrView: {
    width: 300,
    borderTopColor: '#979aa2',
    borderTopWidth: 1,
    paddingTop: 15,
    alignItems: 'center',
  },
  loginFBView: {
    flex: 0.8,
    alignItems: 'center',
  },
  // plusText: {
  //   // fontWeight: 'normal',
  //   // marginTop: 3,
  // },
  facebookButton: {
    marginTop: 15, 
  },
  signUpView: {
    flex: 0.2,
    alignItems: 'center',
  },
  signUpText: {
    color: '#CCCCCC',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
