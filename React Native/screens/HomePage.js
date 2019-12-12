import React, { Component } from 'react'
import { StyleSheet, AsyncStorage, View, SafeAreaView, Platform, ScrollView, Text, ImageBackground, Button, TouchableOpacity, Share, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { Feather } from '@expo/vector-icons';
import Modal from "react-native-modal";
// Constants
import ROOT from '../constants/Root'
// Components
import Header_HomePage from '../components/HomePage/Header_HomePage'
import Categories_HomePage from '../components/HomePage/Categories_HomePage'
import ProductsContainer from '../components/HomePage/ProductsContainer'

export default class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timeData: [],
      recommendData: [],
      popularData: [],
      cash: 0,
      isModalVisible: false,
      isModal2Visible: false,
      userReward: 0,
      userScore: 0,
      userScoreTotal: 0,
    }
  }
  // const myRef = React.createRef()

  getTimeRecommendation = async () => {
    try {
      const token = await AsyncStorage.getItem('@userToken');
      const today = new Date();
      const current_time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
      const response = await fetch(ROOT + `/gettimerecommendationdeal?userId=${token}&currentTime=${current_time}`);
      const jsonData = await response.json();
      this.setState({ timeData: jsonData[0] })
    } catch (error) {
      console.log(error)
    }
  }
  getUserCash = async () => {
    try {
      const userId = await AsyncStorage.getItem('@userToken');
      const response = await fetch(ROOT + `/getuserinfobyid?userId=${userId}`);
      const jsonData = await response.json();
      this.setState({ cash: jsonData[0].userCash })
      this.setState({ userReward: jsonData[0].userReward })
      this.setState({ userScore: jsonData[0].userScore })
      this.setState({ userScoreTotal: jsonData[0].userScoreTotal })
    } catch (error) {
      console.log(error)
    }
  }
  getRecommendation = async () => {
    try {
      const token = await AsyncStorage.getItem('@userToken');
      const response = await fetch(ROOT + `/getrecommendeddeal?userId=${token}`);
      const jsonData = await response.json();
      this.setState({ recommendData: jsonData[0] })
    } catch (error) {
      console.log(error)
    }
  }
  getPopular = async () => {
    try {
      const response = await fetch(ROOT + `/getpopulardeal`);
      const jsonData = await response.json();
      this.setState({ popularData: jsonData[0] })
    } catch (error) {
      console.log(error)
    }
  }
  getToken = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return;
    }
    let token = await Notifications.getExpoPushTokenAsync();
    this.postUserToken(token)
  }
  postUserToken = async (userToken) => {
    try {
      const userId = await AsyncStorage.getItem('@userToken');
      const response = await fetch(ROOT + `/postusertoken?userToken=${userToken}&userId=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const jsonData = await response.json();
    } catch (error) {
      console.log(error)
    }
  }
  putUserScore = async (userScore, userScoreTotal) => {
    const userId = await AsyncStorage.getItem('@userToken');
    const response = await fetch(ROOT + `/applyscore?userScore=${userScore}&userId=${userId}&userScoreTotal=${userScoreTotal}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const jsonData = await response.json();
    return jsonData;
  }
  onShare = async () => {
    try {
      const result = await Share.share({
        title: '',
        message: "Address"
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
          this.setState({ isModalVisible: false })
          this.setState({ isModal2Visible: true })
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      alert(error.message);
    }
  };
  componentWillMount() {
    this.getToken();
    this.listener = Notifications.addListener(this.listen);
  }
  componentWillUnmount() {
    this.listener && Notifications.removeListener(this.listen)
    this.focusListener.remove();
  }
  listen = (notification) => {
    if (notification.origin == 'selected') {
      this.setState({ isModalVisible: true })
    }
  }
  hideLightBox = () => {
    this.setState({ isModalVisible: false })
  }
  hideLightBox2 = () => {
    this.setState({ isModal2Visible: false })
    this.putUserScore(this.state.userScore + 20, this.state.userScoreTotal + 20)
  }
  async componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = await navigation.addListener('didFocus', async () => {
      await this.getTimeRecommendation();
      await this.getRecommendation();
      await this.getPopular();
      await this.getUserCash();
    });
  }
  render() {
    return (
      <SafeAreaView style={styles.safeAreaViewStyle}>
        <View style={styles.container}>
          <Modal isVisible={this.state.isModalVisible}>
            <View style={{ flex: 0.5, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' }}>
              <ImageBackground
                source={require('../assets/images/light-box-bg.png')}
                style={{
                  height: hp(25),
                  width: '100%',
                  borderRadius: 10
                }}
              >
                <TouchableOpacity
                  onPress={() => this.hideLightBox()}
                  style={{
                    justifyContent: 'flex-start',
                    alignItems: 'flex-end',
                    marginRight: hp(1),
                    marginTop: hp(1)
                  }}>
                  <Feather name="x" size={32} />
                </TouchableOpacity>
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: hp(5) }}>
                  <Text
                    style={{
                      fontFamily: 'Roboto',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: hp(3),
                    }}
                  >Chúc mừng bạn nhận được 10{'\n'}điểm kết nối</Text>
                </View>
              </ImageBackground>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: hp(2.5),
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#AE2070',
                    fontFamily: 'Roboto'
                  }}
                >Chia sẻ ngay - nhận điểm liền tay</Text>
                <Text
                  style={{
                    fontSize: hp(2.5),
                    textAlign: 'center',
                    fontFamily: 'Roboto',
                    marginVertical: hp(2)
                  }}
                >Chia sẻ lên facebook và nhận 20 điểm {'\n'} kết nối ngay</Text>
              </View>
              <View style={{
                width: '90%'
              }}
              >
                <Button
                  title='Chia sẻ ngay!!'
                  color={'#AE2070'}
                  onPress={() => this.onShare()}
                />
              </View>
            </View>
          </Modal>
          <Modal isVisible={this.state.isModal2Visible}>
            <View style={{ flex: 0.32, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' }}>
              <View
                style={{
                  height: hp(10),
                  width: '100%',
                  borderRadius: 10
                }}
              >
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: hp(3) }}>
                  <Text
                    style={{
                      fontFamily: 'Roboto',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: hp(3),
                    }}
                  >Chúc Mừng</Text>
                </View>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: hp(3),
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#828282',
                    fontFamily: 'Roboto',
                    marginTop: hp(2)
                  }}
                >Bạn đã chia sẻ và nhận được 20 điểm kết nối</Text>
              </View>
              <View style={{
                width: '90%',
                marginTop: hp(3)
              }}
              >
                <Button
                  title='Xác nhận'
                  color={'#AE2070'}
                  onPress={() => this.hideLightBox2()}
                  buttonStyle={{ backgroundColor: '#AE2070' }}
                />
              </View>
            </View>
          </Modal>
          <View style={styles.headerContaier}>
            <Header_HomePage
              cash={this.state.cash}
              userReward={this.state.userReward}
            />
          </View>
          <ScrollView style={styles.bodyContainer} >
            <View style={styles.categories}>
              <Categories_HomePage />
            </View>
            <View style={styles.bodyElement}>
              <ProductsContainer
                title='Dành riêng cho bạn'
                data={this.state.timeData}
                navigation={this.props.navigation}
              />
            </View>
            <View style={styles.bodyElement}>
              <ProductsContainer
                title='Có thể bạn hứng thú'
                data={this.state.recommendData}
                navigation={this.props.navigation}
              />
            </View>
            <View style={styles.bodyElement}>
              <ProductsContainer
                title='Phổ biến'
                data={this.state.popularData}
                navigation={this.props.navigation}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

HomePage.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? hp(3) : 0,
    backgroundColor: '#325340',
  },
  container: {
    flex: 1,
    backgroundColor: '#EDEEEE',
    alignItems: 'center'
  },
  headerContaier: {
    flex: 0.45
  },
  bodyContainer: {
    flex: 0.65
  },
  categories: {
    flex: 1 / 3,
    height: hp(30),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: hp(2.5),

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  bodyElement: {
    flex: 1 / 3,
    height: hp(36),
    marginTop: hp(2.5),
  }
});
