import React, { Component, useState, useEffect } from 'react'
import { StyleSheet, AsyncStorage, Text, View, SafeAreaView, Platform, Dimensions, ScrollView } from 'react-native'
// Constants
import ROOT from '../constants/Root'
// Components
import Header_HomePage from '../components/HomePage/Header_HomePage'
import Categories_HomePage from '../components/HomePage/Categories_HomePage'
import ProductsContainer from '../components/HomePage/ProductsContainer'

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export default function HomePage(props) {
  const [timeData, setTimeData] = useState([])
  const [recommendData, setRecommendData] = useState([])
  const [popularData, setPopularData] = useState([])
  // const myRef = React.createRef()
  
  getTimeRecommendation = async () => {
    try {
      const token = await AsyncStorage.getItem('@userToken');
      const response = await fetch(ROOT + `/gettimerecommendationdeal?userId=${token}`);
      const jsonData = await response.json();
      setTimeData(jsonData[0])
    } catch (error) {
      console.log(error)
    }
  }
  getRecommendation = async () => {
    try {
      const token = await AsyncStorage.getItem('@userToken');
      const response = await fetch(ROOT + `/getrecommendeddeal?userId=${token}`);
      const jsonData = await response.json();
      setRecommendData(jsonData[0])
    } catch (error) {
      console.log(error)
    }
  }
  getPopular = async () => {
    try {
      const response = await fetch(ROOT + `/getpopulardeal`);
      const jsonData = await response.json();
      setPopularData(jsonData[0])
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    // myRef.current.scrollTo(0,0);
    getTimeRecommendation();
    getRecommendation();
    getPopular();
  }, [])
  return (
    <SafeAreaView style={styles.safeAreaViewStyle}>
      <View style={styles.container}>
        <View style={styles.headerContaier}>
          <Header_HomePage />
        </View>
        <ScrollView style={styles.bodyContainer} >
          <View style={styles.categories}>
            <Categories_HomePage />
          </View>
          <View style={styles.bodyElement}>
            <ProductsContainer 
              title='Dành riêng cho bạn'
              data={timeData}
              navigation={props.navigation}
            />
          </View>
          <View style={styles.bodyElement}>
            <ProductsContainer 
              title='Có thể bạn hứng thú'
              data={recommendData}
              navigation={props.navigation}
            />
          </View>
          <View style={styles.bodyElement}>
            <ProductsContainer 
              title='Phổ biến'
              data={popularData}
              navigation={props.navigation}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

HomePage.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: '#325340',
  },
  container: {
    flex: 1,
    backgroundColor: '#EDEEEE',
    alignItems: 'center'
  },
  headerContaier: {
    flex: 0.35
  },
  bodyContainer: {
    flex: 0.65
  },
  categories: {
    flex: 1 / 3,
    height: height / 4,
    backgroundColor: 'white',
    borderRadius: 10,  
    marginTop: 20,

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
    height: height / 2.8,
    marginTop: 20,
  }
});
