import React, { Component } from 'react'
import { 
  StyleSheet, 
  View, 
  SafeAreaView, 
  Platform, 
  ScrollView,
  Image,
  Text, 
  TouchableOpacity, Alert
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
// Constants
import config from '../constants/config'
// Components
import Header_HomePage from '../components/HomePage/Header_HomePage'
import ProductsContainer from '../components/HomePage/ProductsContainer'
import Colors from '../constants/Colors'

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

  onCategoryPress = (categoryId) => {
    // this.props.navigation.navigate('DealDetails', {info: item})
    Alert.alert('You press categoryId ' + categoryId)
  }

  componentDidMount() {
    this.getPopular();
  }
  render() {
    const {products, loading} = this.state;
    const {onCategoryPress} = this
    return (
      <SafeAreaView style={styles.safeAreaViewStyle}>
        <View style={styles.container}>
          <Header_HomePage />
          <ScrollView contentContainerStyle={styles.bodyContainer}>
            <View style={[styles.card, {flexWrap: 'wrap', minHeight: null}]}>
              {categories.map(cate => (
                <TouchableOpacity key={cate.categoryId} style={styles.categoryItem} onPress={() => onCategoryPress(cate.categoryId)}>
                  <View style={[styles.categoryImageWrapper, cate.color]}>
                    <Image style={styles.categoryImage} source={cate.image} />
                  </View>
                  <Text style={styles.categoryName}>{cate.name}</Text>
                </TouchableOpacity>
              ))}
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
    backgroundColor: Colors.primary,
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
  categoryItem: {
    width: '50%',
    alignItems: 'center',
    padding: 15,
  },
  categoryImageWrapper: {
    width: 50,
    height: 50,
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'red',
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 4,
      height: 6
    },
    shadowOpacity: 0.6,
  },
  colorBlue: {
    backgroundColor: '#5ec9f3'
  },
  colorYellow: {
    backgroundColor: '#ffc989'
  },
  colorPink: {
    backgroundColor: '#fc888c'
  },
  colorRed: {
    backgroundColor: '#fb7274'
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  categoryName: {
    marginTop: 10,
    color: '#353b48'
  }
});

const categories = [
  {
    categoryId: 13,
    name: 'Cafe/Dessert',
    image: require('../assets/icons/cafe.png'),
    color: styles.colorBlue
  },
  {
    categoryId: 14,
    name: 'Restaurant',
    image: require('../assets/icons/restaurant.png'),
    color: styles.colorRed
  },
  {
    categoryId: 17,
    name: 'Amusement',
    image: require('../assets/icons/amusement.png'),
    color: styles.colorYellow
  },
  {
    categoryId: 19,
    name: 'Shopping',
    image: require('../assets/icons/shopping.png'),
    color: styles.colorPink
  }
]