

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, ActivityIndicator, ImageBackground, AsyncStorage} from 'react-native';
import { createStackNavigator, createAppContainer, StackActions, NavigationActions, StackNavigator } from "react-navigation";
// import  firebase from 'react-native-firebase';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default class Splash extends Component {

  static navigationOptions = {
    header: null
  }
  state = {
    error: null
  }
    constructor(props) {
        super(props);

    }
    componentDidMount() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          AsyncStorage.setItem("latitude", position.coords.latitude.toString())
          AsyncStorage.setItem("longitude", position.coords.longitude.toString())
        },
        (error) => this.setState({ error: error.message }),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
      
      this.timeoutHandle = setTimeout(()=>{
        this.resetNavigation('Login');
   }, 3000);
  }
  componentWillUnmount(){
    clearTimeout(this.timeoutHandle); // This is just necessary in the case that the screen is closed before the timeout fires, otherwise it would cause a memory leak that would trigger the transition regardless, breaking the user experience.
}

  resetNavigation(targetRoute) {
    const resetAction = StackActions.reset({
        index: 0,
        actions: [
        NavigationActions.navigate({ routeName: targetRoute }),
        ],
    });
    this.props.navigation.dispatch(resetAction);
}
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground style={styles.imageBack} source={require('../resources/images/splash.png')}/>
        <ActivityIndicator style={{marginBottom: 40}}></ActivityIndicator>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  imageBack: {
    flex: 1,
    resizeMode: 'stretch',
    height: hp('100%'), 
    width: wp('100%'),  
  }
});
