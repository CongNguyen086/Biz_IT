import React from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import { Divider } from 'react-native-elements';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { SafeAreaView } from 'react-navigation';
import * as Animatable from 'react-native-animatable'

const screenHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'white',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 10,
  },
  dragHandler: {
    paddingVertical: 10,
    alignItems: 'center'
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: 15,
  },
  bar: {
    width: 35,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd'
  }
})

export default React.forwardRef(({ children, headerTitle = null, ...props }, ref) => (
  <SlidingUpPanel ref={ref}
    draggableRange={{ top: screenHeight - 100, bottom: 100 }}
    friction={0.05}
    {...props}
  >
    <SafeAreaView style={{
      flex: 1,
      zIndex: 1,
    }}>
      <Animatable.View 
        animation='fadeInUp' 
        style={styles.container}
        duration={400}
      >
        <View style={styles.dragHandler}>
          <View style={styles.bar} />
        </View>
        {headerTitle !== null && (
          <React.Fragment>
            <View style={styles.headerTitle}>
              {typeof headerTitle === 'string' ? (
                <Text style={styles.label}>{headerTitle}</Text>
              ) : (
                headerTitle
              )}
            </View>
            <Divider style={styles.separator} />
          </React.Fragment>
        )}
        <View style={styles.content}>
          {children}
        </View>
      </Animatable.View>
    </SafeAreaView>
  </SlidingUpPanel>
))