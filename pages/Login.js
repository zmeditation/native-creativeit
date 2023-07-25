

import React, { Component } from 'react';
import { Platform, ImageBackground } from 'react-native';
// import { LoginManager } from 'react-native-fbsdk';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
    Alert,
    AsyncStorage,
    TextInput,
    Text,
    View,
    Image,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    TouchableHighlight,
    KeyboardAvoidingView
} from 'react-native';
import { createStackNavigator, createAppContainer, StackNavigator, StackActions, NavigationActions } from "react-navigation";
import { LoginManager , AccessToken} from 'react-native-fbsdk'

const GLOBAL = require('../Global')
export default class Login extends Component {
    static navigationOptions = {
        header: null
    }

    state = {
        showSpinner: false,
        location: null,
        errorMessage: null,
        skipState: false,   //Fix Part
        latitude: 0.0,
        longitude: 0.0,
        push_token: '',
        token: null,
    };
    constructor(props) {
        super(props);
        console.log("LoginConstructor");
        this.state.showSpinner = false;
        AsyncStorage.getItem('user_phone').then((value) => {
            console.log(value);
            if (value != null && value != '') {
                this.setState({ skipState: true });
            }
        });
        AsyncStorage.getItem('latitude').then((value) => {
            console.log(value);
            if (value != null && value != '') {
                let temp = parseFloat(value);
                this.setState({ latitude: temp });
            }
        });
        AsyncStorage.getItem('longitude').then((value) => {
            console.log(value);
            if (value != null && value != '') {
                let temp = parseFloat(value);
                this.setState({ longitude: temp });
            }
        });
        this._tempUserData();
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



    _tempUserData(){
        AsyncStorage.setItem('user_id', '1');
        AsyncStorage.setItem('user_name', 'Jakub Motyka');
        AsyncStorage.setItem('user_email', 'jakub0225@hotmail.com');
        
        AsyncStorage.setItem('user_photo', 'https://graph.facebook.com/377782832964708/picture?height=500');
        // if(AsyncStorage.getItem('user_phone') != null && AsyncStorage.getItem('user_phone') != ''){
        // console.log(AsyncStorage.getItem('user_phone'));
        // }else{
        AsyncStorage.setItem('user_phone', '12264558168');
        AsyncStorage.setItem('user_address', 'Ulan Bator MN');
        AsyncStorage.setItem('user_gender', 'Male');
        AsyncStorage.setItem('user_state', 'Marriage');
        AsyncStorage.setItem('user_professional', 'Full Stack Developer');
        AsyncStorage.setItem('user_status', 'active');
        AsyncStorage.setItem('push_status', 'active');
        AsyncStorage.setItem('vip', 'vip');
    }

    _onLogin = async () => {

        console.log('loginBttn');

        if (this.state.skipState) {
            this.resetNavigation('Tab');
        } else {
            //FIX PART - FACEBOOK LOGIN
            this.handleFacebookLogin();

        }

    }
  handleFacebookLogin(){
    let self = this;
    LoginManager.logInWithReadPermissions(["public_profile"]).then(
        function(result) {
          if (result.isCancelled) {
             
            console.log("Login cancelled");
          } else {
            console.log(
              "Login success with permissions: " +
                result.grantedPermissions.toString()
            );
            AccessToken.getCurrentAccessToken().then((data) => {
                const { accessToken } = data;
                self.initUser(accessToken);
            });
          }
        },
        function(error) {
          console.log("Login fail with error: " + error);
        }
      );
  }


  initUser(token) {
    
    fetch('https://graph.facebook.com/v2.5/me?fields=email,name&access_token=' + token)
    .then((response) => response.json())
    .then((json) => {
      // Some user object has been set up somewhere, build that user here
        this.register(json);
    })
    .catch((error) => {
      console.log(error)
    })
  }
    _getCurrentLocation(){
        navigator.geolocation.getCurrentPosition(
            (position) => {
              AsyncStorage.setItem("latitude", position.coords.latitude.toString())
              AsyncStorage.setItem("longitude", position.coords.longitude.toString())
              this.setState({latitude: position.coords.latitude});
              this.setState({longitude: position.coords.longitude});
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
          );
    }
    register(userData) {
     
        if (this.state.latitude == 0.0 && this.state.longitude == 0.0) {
            this._getCurrentLocation();
        } else {
            var latitude = this.state.latitude;
            var longitude = this.state.longitude;

            const profileImage = 'https://graph.facebook.com/' + userData.id + '/picture?height=500';
            console.log(profileImage);
            let name = userData.name;
            let params = "user_name=" + name;
            params += "&user_email=" + userData.email;
            params += "&user_photo=" + profileImage;
            params += "&latitude=" + latitude;
            params += "&longitude=" + longitude;
            params += "&facebook_url=" + userData.id;
            params += "&push_token=" + this.state.push_token;
            console.log(params);
            return fetch(GLOBAL.BASE_URL + 'register_user', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params,
            })
                .then((responseJson) => responseJson.json())
                .then((response) => {
                    console.log(response.data.facebook_url);
                    AsyncStorage.setItem('user_id', response.data.id);
                    AsyncStorage.setItem('user_name', response.data.user_name);
                    AsyncStorage.setItem('user_email', response.data.user_email);
                    AsyncStorage.setItem('user_photo', response.data.user_photo);
                    // if(AsyncStorage.getItem('user_phone') != null && AsyncStorage.getItem('user_phone') != ''){
                    // console.log(AsyncStorage.getItem('user_phone'));
                    // }else{
                    AsyncStorage.setItem('user_phone', response.data.user_phone);
                    AsyncStorage.setItem('user_address', response.data.user_address);
                    AsyncStorage.setItem('user_gender', response.data.user_gender);
                    AsyncStorage.setItem('user_state', response.data.user_state);
                    AsyncStorage.setItem('user_professional', response.data.user_professional);
                    AsyncStorage.setItem('user_status', response.data.user_status);
                    AsyncStorage.setItem('push_status', response.data.push_status);
                    this.resetNavigation('Profile');
                    // }

                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={require('../resources/images/splash.png')} style={styles.backgroundImage}>
                    <View style={styles.basicContainer}>
                        {
                            this.state.showSpinner ?
                                <ActivityIndicator size="large" color="#0000ff" style={styles.activityIndicator} /> :
                                <TouchableOpacity onPress={this._onLogin} style={styles.imageContainer}>
                                    <Image
                                        style={styles.button}
                                        source={require('../resources/images/facebook_btn.png')}
                                    />
                                </TouchableOpacity>
                        }
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    basicContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#a91117',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'stretch',
        height: hp('100%'),
        width: wp('100%'),
    },

    button: {

        height: hp('10%'),
        width: wp('80%'),
        resizeMode: 'contain'
    },

    imageContainer: {

        alignItems: 'center',
        height: hp('10%'),
        width: wp('100%'),
        marginBottom: 20,
    },

    activityIndicator: {
        marginBottom: 30,
    }
});
