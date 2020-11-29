import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  ScrollView,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import FBLoginButton from '../components/FBLoginButton';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Facebook from 'expo-facebook';
// Constants
import config from '../constants/config';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { LOGIN_WITH_PHONE } from '../services/auth/constants';
import { getCurrentUser } from '../services/auth/getters';
import Colors from '../constants/Colors';
import { withNavigation } from 'react-navigation';

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: '',
      phone_valid: true,
      password: '',
      loading: false,
    };
  }

  validatePhone(phone) {
    var re = /^\d*$/;

    return re.test(phone);
  }

  _checkLogin = () => {
    const { phone, password } = this.state;
    Keyboard.dismiss();
    this.setState({ loading: true });
    this.props.dispatch({
      type: LOGIN_WITH_PHONE,
      payload: {
        phoneNumber: phone,
        password
      },
      meta: {
        onFailed: () => {
          this.setState({
            loading: false
          })
        }
      }
    })
  };

  async loginFacebook() {
    try {
      const {
        type,
        token,
      } = await Facebook.logInWithReadPermissionsAsync(config.FACEBOOK_API_ID, 
      {
        permissions: [
          'public_profile',
        ],        
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        Alert.alert('Login successfully!', `Hello ${(await response.json()).name}!`);
        // this.props.navigation.navigate('Loading');
      } else {
        // type === 'cancel'
        console.log('Failed')
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
    const { phone, password, phone_valid, loading } = this.state;
    // console.log(SCREEN_HEIGHT);
    return (
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaConsumer style={{flex: 1}}>
          {insets => (
            <ScrollView 
              style={[
                styles.loginView, 
                {
                  paddingTop: insets.top,
                  paddingBottom: insets.bottom,
                  paddingLeft: insets.left,
                  paddingRight: insets.right
                }
              ]}
              contentContainerStyle={styles.scrollViewContent}
            >
              <View style={styles.logoContainer}>
                <Image style={styles.logoImage} source={require('../assets/images/logo.png')} />
              </View>
              <View style={styles.loginInput}>
                <Input
                  leftIcon={
                    <Icon
                      name="user-o"
                      type="font-awesome"
                      color="#fff"
                      size={hp(3)}
                    />
                  }
                  containerStyle={{ marginVertical: hp(1.5) }}
                  inputContainerStyle={{borderBottomColor: '#fff'}}
                  onChangeText={phone => this.setState({ phone: phone })}
                  value={phone}
                  inputStyle={{ marginLeft: wp(3), color: '#fff' }}
                  keyboardAppearance="light"
                  placeholder="Phone number"
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
                  placeholderTextColor="#fff"
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
                      color="#fff"
                      size={hp(3)}
                    />
                  }
                  containerStyle={{ marginVertical: hp(1.5) }}
                  inputContainerStyle={{borderBottomColor: '#fff'}}
                  onChangeText={password => this.setState({ password })}
                  value={password}
                  inputStyle={{ marginLeft: wp(4), color: '#fff' }}
                  secureTextEntry={true}
                  keyboardAppearance="light"
                  placeholder="Password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  ref={input => (this.passwordInput = input)}
                  blurOnSubmit={true}
                  placeholderTextColor="#fff"
                />
              </View>
              <View style={styles.plusView}>
                <Button
                  title="Forgot password?"
                  type="clear"
                  activeOpacity={0.5}
                  titleStyle={styles.plusTitle}
                  // containerStyle={styles.plusText}
                  onPress={() => console.log('You press forgot password')}
                />
              </View>
              <Button
                title="Login"
                activeOpacity={1}
                underlayColor="transparent"
                onPress={this._checkLogin}
                loading={loading}
                loadingProps={{ size: 'small', color: 'white' }}
                disabledStyle={{backgroundColor: 'transparent'}}
                disabled={(!phone_valid && password.length < 8) || loading}
                buttonStyle={{
                  height: 50,
                  backgroundColor: 'transparent',
                  borderWidth: 1.5,
                  borderColor: 'white',
                  borderRadius: 30,
                }}
                containerStyle={styles.nextButton}
                titleStyle={{ fontWeight: '600', color: '#fff', textTransform: 'uppercase' }}
              />
              <View style={styles.footerView}>
                <View style={styles.plusOrView}>
                  <View style={styles.orBar} />
                  <Text style={styles.plusTitle}>Or</Text>
                  <View style={styles.orBar} />
                </View>
                <Button 
                  title="Register"
                  activeOpacity={1}
                  disabled={!phone_valid && password.length < 8}
                  onPress={() => this.props.navigation.navigate("Register")}
                  buttonStyle={{
                    height: 50,
                    backgroundColor: 'transparent',
                    borderWidth: 1.5,
                    borderColor: 'white',
                    borderRadius: 30,
                  }}
                  containerStyle={styles.nextButton}
                  titleStyle={{ fontWeight: '500', color: '#fff' }} 
                />
                <View style={styles.loginFBView}>
                  <FBLoginButton loginWithFacebook={this.loginFacebook} />
                </View>
              </View>
            </ScrollView>
          )}
        </SafeAreaConsumer>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({
  currentUser:  getCurrentUser(state)
})

export default connect(mapStateToProps, null)(withNavigation(LoginScreen))

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain'
  },
  loginView: {
    flex: 1,
  },
  scrollViewContent: {
    maxWidth: 500,
    paddingHorizontal: 50,
    flex: 1,
  },
  loginInput: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusView: {
    alignItems: 'flex-end',
  },
  nextButton: {
    marginTop: 35,
  },
  plusTitle: {
    fontFamily: 'Roboto-Regular',
    color: '#fff',
    fontSize: 20,
    textAlign: 'center'
  },
  footerView: {
    marginTop: 50,
    justifyContent: 'space-between',
  },
  plusOrView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  orBar: {
    flex: 1,
    height: 2,
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
  loginFBView: {
    marginTop: 20,
  },
});
