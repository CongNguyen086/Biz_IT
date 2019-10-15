import { Dimensions } from 'react-native';

const width = Dimensions.get('screen').width; // Temp: 393
const height = Dimensions.get('screen').height; // Temp: 851

export default {
  screen: {
    width,
    height,
  },
  isSmallDevice: width < 375,
};
