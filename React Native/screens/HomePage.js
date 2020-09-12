import React, { Component } from 'react'
import { 
  StyleSheet, 
  View, 
  SafeAreaView, 
  Platform, 
  ScrollView,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
// Constants
import config from '../constants/config'
// Components
import Header_HomePage from '../components/HomePage/Header_HomePage'
import ProductsContainer from '../components/HomePage/ProductsContainer'
import Categories_HomePage from '../components/HomePage/Categories_HomePage';

export default class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      products: [],
      isModalVisible: false,
      isModal2Visible: false,
    }
  }

  getPopular = async () => {
    try {
      this.setState({loading: true})
      const response = await fetch(config.ROOT + `/getpopulardeal`);
      const jsonData = await response.json();
      this.setState({ products: jsonData[0], loading: false })
    } catch (error) {
      console.log(error)
    }
  }
  componentDidMount() {
    this.getPopular();
  }
  render() {
    const {products, loading} = this.state;
    return (
      <SafeAreaView style={styles.safeAreaViewStyle}>
        <View style={styles.container}>
          <Header_HomePage />
          <ScrollView contentContainerStyle={styles.bodyContainer}>
            <View style={styles.card}>
              <Categories_HomePage />
            </View>
            <View style={[styles.card, {flex: 1, marginBottom: 15}]}>
              <ProductsContainer
                title='Phổ biến'
                products={products}
                loading={loading}
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
  },
  bodyContainer: {
    paddingHorizontal: 15,
  },
  card: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    minHeight: 150,
    marginTop: hp(2.5),
    backgroundColor: 'white',
    borderRadius: 10,

    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: {
      width: 2,
      height: 8,
    },
    shadowOpacity: 0.5,
    elevation: 3,
  },
});
