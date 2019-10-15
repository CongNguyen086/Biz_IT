import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Platform, Dimensions, ScrollView } from 'react-native';

//Components
import Header_HomePage from './components/Header_HomePage.js'
import Categories_HomePage from './components/Categories_HomePage.js'
import ProductsContainer from './components/ProductsContainer.js'

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

export default function App() {
  const [timeData, setTimeData] = useState([])
  const [recommendData, setRecommendData] = useState([])
  const [popularData, setPopularData] = useState([])
  getTimeRecommendation = async () => {
    try {
      const response = await fetch('http://192.168.1.15:3000/gettimerecommendationdeal/8159657106479438377');
      const jsonData = await response.json();
      setTimeData(jsonData[0])
    } catch (error) {
      console.log(error)
    }
  }
  getRecommendation = async () => {
    try {
      const response = await fetch('http://192.168.1.15:3000/getrecommendeddeal/8159657106479438377');
      const jsonData = await response.json();
      setRecommendData(jsonData[0])
    } catch (error) {
      console.log(error)
    }
  }
  getPopular = async () => {
    try {
      const response = await fetch('http://192.168.1.15:3000/getpopulardeal');
      const jsonData = await response.json();
      setPopularData(jsonData[0])
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
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
            />
          </View>
          <View style={styles.bodyElement}>
            <ProductsContainer 
              title='Có thể bạn hứng thú'
              data={recommendData}
            />
          </View>
          <View style={styles.bodyElement}>
            <ProductsContainer 
              title='Phổ biến'
              data={popularData}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}



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
    height: height / 3.5
  },
  bodyElement: {
    flex: 1 / 3,
    height: height / 2.8
  }
});
